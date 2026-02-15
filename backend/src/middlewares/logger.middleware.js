const requestLogger = (req, res, next) => {
  const startTime = new Date();
  const ip = req.ip || req.connection.remoteAddress;

  // Capture the response status
  res.on("finish", () => {
    const endTime = new Date();
    const duration = endTime - startTime;
    const timestamp = startTime.toISOString();
    const method = req.method;
    const status = res.statusCode;
    const url = req.originalUrl;

    console.log(
      `[${timestamp}] ${method} ${url} - Status: ${status} - IP: ${ip} - Duration: ${duration}ms`
    );
  });

  next();
};

export { requestLogger };
