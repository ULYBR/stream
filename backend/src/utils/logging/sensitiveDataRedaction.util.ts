import fastRedact from "fast-redact";

export const redactSensitiveData = (content, env) => {
  const redact = fastRedact({
    serialize: false,
    paths: ["prod", "prd", "production"].includes(env)
      ? ["*.taxNumberId", "*.userDocument"]
      : [],
    censor: "***SENSITIVE DATA***",
  });

  return redact(content);
};

export const removeUserDocument = (content, env) => {
  return ["prod", "prd", "production"].includes(env)
    ? content.replace(
        /userDocument=[0-9]{11}/g,
        "userDocument=***SENSITIVE DATA***",
      )
    : content;
};
