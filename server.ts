import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "./build/index.js";

//
import { getAuthUser } from "./load-context";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    
    const authUser = await getAuthUser(request, env);
    const userId = authUser?.id ?? "anonymous";

    
    const kvKey = `todos:user:${userId}`;
    
    const requestWithContext = new Request(request.url, request);
    requestWithContext["context"] = {
      kv: env.TO_DO_LIST,
      kvKey,
      userId,
    };
   
       
    return createRequestHandler({
      build,
      getLoadContext() {
        return {
          kv: env.TO_DO_LIST,
          kvKey,
          userId,
        };
      },
    })(requestWithContext, env, ctx);
  },
};
