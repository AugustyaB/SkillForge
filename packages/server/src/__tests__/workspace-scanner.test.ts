import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  parsePackageJson,
  parseRequirementsTxt,
  parseCargoToml,
  parseGoMod,
  parsePomXml,
  WorkspaceScanner,
} from '../context/workspace-scanner.js';

describe('WorkspaceScanner & Manifest Parsers', () => {
  describe('parsePackageJson', () => {
    it('extracts production and dev dependencies from package.json', () => {
      const pkgJson = JSON.stringify({
        name: 'test-app',
        dependencies: {
          express: '^4.19.2',
          'socket.io': '^4.7.5',
        },
        devDependencies: {
          vitest: '^1.5.0',
          typescript: '^5.4.0',
        },
      });

      const detected = parsePackageJson(pkgJson);
      expect(detected).toHaveLength(4);

      const names = detected.map((d) => d.name);
      expect(names).toContain('express');
      expect(names).toContain('socket.io');
      expect(names).toContain('vitest');
      expect(names).toContain('typescript');

      const expressPkg = detected.find((d) => d.name === 'express');
      expect(expressPkg?.version).toBe('^4.19.2');
      expect(expressPkg?.ecosystem).toBe('javascript');
    });

    it('handles empty or malformed package.json safely', () => {
      expect(parsePackageJson('{}')).toHaveLength(0);
      expect(parsePackageJson('not valid json')).toHaveLength(0);
    });
  });

  describe('parseRequirementsTxt', () => {
    it('extracts python package names stripping comments and version specifiers', () => {
      const content = `
        # Web framework
        fastapi==0.110.0
        uvicorn[standard]>=0.28.0
        
        # Database
        sqlalchemy>=2.0.28; python_version > '3.8'
        psycopg2-binary<=2.9.9
        
        # Testing
        pytest~=8.1.1
        -r other-requirements.txt
      `;

      const detected = parseRequirementsTxt(content);
      const names = detected.map((d) => d.name);

      expect(names).toContain('fastapi');
      expect(names).toContain('uvicorn');
      expect(names).toContain('sqlalchemy');
      expect(names).toContain('psycopg2-binary');
      expect(names).toContain('pytest');

      for (const d of detected) {
        expect(d.ecosystem).toBe('python');
      }
    });
  });

  describe('parseCargoToml', () => {
    it('extracts crates from [dependencies]', () => {
      const content = `
        [package]
        name = "my-service"
        version = "0.1.0"
        edition = "2021"

        [dependencies]
        axum = "0.7"
        tokio = { version = "1.0", features = ["full"] }
        serde = "1.0"

        [dev-dependencies]
        tokio-test = "0.4"
      `;

      const detected = parseCargoToml(content);
      const names = detected.map((d) => d.name);

      expect(names).toContain('axum');
      expect(names).toContain('tokio');
      expect(names).toContain('serde');
      expect(names).toContain('tokio-test');

      for (const d of detected) {
        expect(d.ecosystem).toBe('rust');
      }
    });
  });

  describe('parseGoMod', () => {
    it('extracts modules from require block and single require lines', () => {
      const content = `
        module example.com/my-api

        go 1.22

        require (
          github.com/gin-gonic/gin v1.9.1
          gorm.io/gorm v1.25.7
        )

        require github.com/google/uuid v1.6.0
      `;

      const detected = parseGoMod(content);
      const names = detected.map((d) => d.name);

      expect(names).toContain('github.com/gin-gonic/gin');
      expect(names).toContain('gorm.io/gorm');
      expect(names).toContain('github.com/google/uuid');

      for (const d of detected) {
        expect(d.ecosystem).toBe('go');
      }
    });
  });

  describe('parsePomXml', () => {
    it('extracts artifactId dependencies from pom.xml', () => {
      const content = `
        <project>
          <dependencies>
            <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
            </dependency>
            <dependency>
              <groupId>org.postgresql</groupId>
              <artifactId>postgresql</artifactId>
            </dependency>
          </dependencies>
        </project>
      `;

      const detected = parsePomXml(content);
      const names = detected.map((d) => d.name);

      expect(names).toContain('spring-boot-starter-web');
      expect(names).toContain('postgresql');

      for (const d of detected) {
        expect(d.ecosystem).toBe('java');
      }
    });
  });

  describe('WorkspaceScanner.scanScope', () => {
    let tmpDir: string;
    let scanner: WorkspaceScanner;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skillforge-test-'));
      scanner = new WorkspaceScanner();
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('scans a directory with package.json and extracts context', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({
          dependencies: {
            express: '^4.19.0',
            prisma: '^5.11.0',
          },
        })
      );

      const context = await scanner.scanScope(tmpDir);

      expect(context.scope.paths).toContain(tmpDir);
      expect(context.ecosystem).toBe('javascript');
      expect(context.alreadyInstalled).toContain('express');
      expect(context.alreadyInstalled).toContain('prisma');
      expect(context.detectedStack).toHaveLength(2);
    });

    it('returns empty context when path does not exist', async () => {
      const nonExistent = path.join(tmpDir, 'does-not-exist');
      const context = await scanner.scanScope(nonExistent);

      expect(context.alreadyInstalled).toHaveLength(0);
      expect(context.detectedStack).toHaveLength(0);
    });
  });
});
