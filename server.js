/* Static Files */
app.use(express.static(path.join(__dirname, "public")));

/* Body Parser — MUST be BEFORE routes */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Sessions */
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

/* Flash Messages */
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

/* Routes */
const staticRoutes = require("./routes/static");
app.use("/", staticRoutes);
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
