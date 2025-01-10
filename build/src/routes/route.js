"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const home_route_1 = require("./home.route");
const middlewares_1 = require("../middlewares");
const participant_1 = require("./participant");
const event_1 = require("./event");
const auth_1 = require("./auth");
class Routes {
    constructor(app) {
        this.app = app;
        this.homeRoute = new home_route_1.HomeRoute();
        this.firebaseMiddleware = new middlewares_1.FirebaseMiddleware();
        this.combinedAuthMiddleware = new middlewares_1.CombinedAuthMiddleware();
        this.participantRoute = new participant_1.ParticipantRoute();
        this.authRoute = new auth_1.AuthRoute();
        this.eventRoute = new event_1.EventRoute();
        this.app.use('/api', this.homeRoute.router);
        this.app.use('/api/participants', this.firebaseMiddleware.verify, this.participantRoute.router);
        this.app.use('/api/events', this.combinedAuthMiddleware.verify, this.eventRoute.router);
        this.app.use('/api/auth', this.authRoute.router);
        this.app.use(middlewares_1.NotFoundMiddleware.handle);
        this.app.use(middlewares_1.PrismaErrorMiddleware.handle);
        this.app.use(middlewares_1.GlobalErrorMiddleware.handle);
    }
}
exports.Routes = Routes;
