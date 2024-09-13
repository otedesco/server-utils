import { Router } from "express";
import _ from "lodash";
import { describe, expect, test, vi } from "vitest";

import AppFactory from "../AppFactory";
import type { ConfigOptions } from "../interfaces";

const mockLogger = {
  info: (message: string) => message,
  error: (message: string) => message,
};

const defaultConfig = {
  logger: mockLogger as unknown as ConfigOptions["logger"],
  routes: [],
};

describe("AppFactory", () => {
  describe("initializeExpressMiddlewares method", () => {
    class MockAppFactory extends AppFactory {
      protected initializeErrorHandling(): void {}
    }

    test("should initialize express middlewares with default options", () => {
      const app = new MockAppFactory(defaultConfig);
      const infoSpy = vi.spyOn(mockLogger, "info");

      //@ts-expect-error
      app.initializeExpressMiddlewares({});

      expect(infoSpy.mock.calls.length).toBe(2);
      expect(infoSpy.mock.calls[0]?.[0]).toBe("Loading default middlewares...");
      expect(infoSpy.mock.calls[1]?.[0]).toBe("Default middlewares loaded");

      infoSpy.mockRestore();
    });
    test("should initialize express middlewares with cors options", () => {
      const app = new MockAppFactory(defaultConfig);
      const infoSpy = vi.spyOn(mockLogger, "info");

      //@ts-expect-error
      app.initializeExpressMiddlewares({ cors: { methods: "GET" } });

      expect(infoSpy.mock.calls.length).toBe(2);
      expect(infoSpy.mock.calls[0]?.[0]).toBe("Loading default middlewares...");
      expect(infoSpy.mock.calls[1]?.[0]).toBe("Default middlewares loaded");

      infoSpy.mockRestore();
    });
  });

  describe("initializeRoutes method", () => {
    class MockAppFactory extends AppFactory {
      protected initializeErrorHandling(): void {}
    }

    test.skip("should initialize routes corectly", () => {
      const routes = [
        {
          version: "v1",
          routes: [{ path: "/foo", router: Router().post("/") }],
        },
        {
          version: "v2",
          routes: [{ path: "/foo", router: Router().post("/") }],
        },
        {
          version: "admin",
          routes: [{ path: "/foo", router: Router().post("/") }],
        },
        {
          version: "foo",
          routes: [{ path: "/foo", router: Router().post("/") }],
        },
      ];
      const infoSpy = vi.spyOn(mockLogger, "info");
      const app = new MockAppFactory({ ...defaultConfig, routes });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      const routers = _.map(app.getServer()._router.stack ?? [], "name").filter((name) => name === "router");
      expect(routers.length).toBe(routes.length);
      expect(infoSpy.mock.calls[2]?.[0]).toBe("Loading routes...");
      expect(infoSpy.mock.calls[3]?.[0]).toBe("Routes loaded");
    });
  });

  describe("initializeConections public method", () => {
    class MockAppFactory extends AppFactory {
      protected initializeErrorHandling(): void {}
    }

    test("should initialize connections", async () => {
      const app = new MockAppFactory(defaultConfig);
      const infoSpy = vi.spyOn(mockLogger, "info");
      await app.initializeConnections(new Promise((resolve) => resolve()));

      expect(infoSpy.mock.calls[0]?.[0]).toBe("Connections initialized");
    });

    test("should throw", async () => {
      const app = new MockAppFactory(defaultConfig);
      const errorSpy = vi.spyOn(mockLogger, "error");
      const errorMessage = "connections failed";
      try {
        await app.initializeConnections(new Promise((_, reject) => reject(new Error(errorMessage))));
      } catch (err) {
        expect((err as Error).message).toBe(errorMessage);
        expect(errorSpy.mock.calls[0]?.[0]).toBe("An Error has occurred during connection init");
      }
    });
  });

  describe("listen public method", () => {
    class MockAppFactory extends AppFactory {
      protected initializeErrorHandling(): void {}
    }

    test("should initialize connections", () => {
      const app = new MockAppFactory(defaultConfig);
      const listenSpy = vi.spyOn(app.getServer(), "listen");
      app.listen();

      expect(listenSpy).toHaveBeenCalledTimes(1);
      expect(listenSpy.mock.calls[0]?.[0]).toBe(3000);
    });
  });
});
