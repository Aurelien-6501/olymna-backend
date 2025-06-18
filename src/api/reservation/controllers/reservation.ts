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

    async delete(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("Authentication required");
      }

      const { id } = ctx.params;

      // Vérifie si la réservation existe et appartient à l'utilisateur
      const reservation = await strapi.entityService.findOne(
        "api::reservation.reservation",
        id,
        { populate: { user: true } }
      );

      if (!reservation) {
        return ctx.notFound("Reservation not found");
      }

      if (reservation.user.id !== user.id) {
        return ctx.forbidden("You are not allowed to delete this reservation");
      }

      await strapi.entityService.delete("api::reservation.reservation", id);

      return ctx.send({ message: "Reservation deleted successfully" });
    },
  })
);
