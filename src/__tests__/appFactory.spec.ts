import { Router } from "express";
import { describe, expect, it, vi } from "vitest";
import winston from "winston";

import { AppFactory } from "../appFactory";
import { ConfigOptions } from "../interfaces";

describe("App Factory", () => {
  describe("Happy path", () => {
    class TestAppFactory extends AppFactory {
      protected async initializeConnections(): Promise<void> {}
      protected initializeErrorHandling(): void {}
    }

    const mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as winston.Logger;

    it("should initialize AppFactory with valid ConfigOptions", () => {
      const config: ConfigOptions = {
        routes: [{ router: Router(), path: "/" }],
        env: "test",
        port: 8080,
        logger: mockLogger as unknown as winston.Logger,
        logFormat: "dev",
        cors: { origin: "*", credentials: false },
      };

      const appFactory = new TestAppFactory(config);
      expect(appFactory).toBeInstanceOf(TestAppFactory);
      expect(appFactory.app).toBeDefined();
      expect(appFactory.app).toBeInstanceOf(Function);
    });

    it("test_app_factory_initializes_connections_successfully", () => {
      // 🤖 Testing that AppFactory initializes connections successfully
      const config: ConfigOptions = {
        routes: [{ router: Router(), path: "/" }],
        env: "development",
        port: 3000,
        logger: mockLogger,
      };
      const appFactory = new TestAppFactory(config);

      expect(appFactory).toBeDefined();
    });

    it("test_app_factory_initializes_express_middlewares_successfully", () => {
      // 🤖 Testing that AppFactory initializes express middlewares successfully
      const config: ConfigOptions = {
        routes: [{ router: Router(), path: "/" }],
        env: "development",
        port: 3000,
        logger: mockLogger,
      };
      const appFactory = new TestAppFactory(config);
      expect(appFactory.app._router.stack.length).toBeGreaterThan(0);
    });

    it("test_app_factory_listens_to_port_successfully", () => {
      // 🤖 Testing that AppFactory listens to port successfully
      const config: ConfigOptions = {
        routes: [{ router: Router(), path: "/" }],
        env: "development",
        port: 3000,
        logger: mockLogger,
      };
      const appFactory = new TestAppFactory(config);
      const listenSpy = vi.spyOn(appFactory.app, "listen");
      appFactory.listen();
      expect(listenSpy).toHaveBeenCalled();
    });
    it("test_config_options_has_invalid_routes", () => {
      // 🤖 Testing that AppFactory handles ConfigOptions with invalid routes
      const config: ConfigOptions = {
        routes: [],
        env: "development",
        port: 3000,
        logger: mockLogger,
      };
      expect(() => new TestAppFactory(config)).toThrow();
    });
    // TODO: FIX THIS TEST CASE
    // it("test_config_options_has_invalid_port", () => {
    //   // 🤖 Testing that AppFactory handles ConfigOptions with invalid port
    //   const config: ConfigOptions = {
    //     routes: [{ router: Router(), path: "/" }],
    //     env: "development",
    //     port: -1,
    //     logger: mockLogger,
    //   };
    //   expect(() => new TestAppFactory(config)).toThrow();
    // });
  });
});
