module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;

  if (!user) {
    return policyContext.unauthorized('You must be logged in.');
  }


  try {
    const permissions = await strapi.admin.services.permission.findMany({
      where: {
        subject: 'plugin::strapi-audit-logs-assignment.audit-log',
        action: 'read',
        role: {
          id: user.roles.map(role => role.id)
        }
      }
    });

    if (permissions.length > 0) {
      return true;
    }
  } catch (error) {
    strapi.log.error('Permission check error:', error);
  }

  return policyContext.forbidden('You do not have permission to access audit logs.');
};
