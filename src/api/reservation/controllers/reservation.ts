// src/api/reservation/controllers/reservation.ts
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::reservation.reservation",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("Authentication required");
      }

      const { data } = ctx.request.body;

      const enhancedData = {
        ...data,
        user: user.id,
      };

      const entity = await strapi.entityService.create(
        "api::reservation.reservation",
        {
          data: enhancedData,
        }
      );

      return ctx.created(entity);
    },
  })
);
