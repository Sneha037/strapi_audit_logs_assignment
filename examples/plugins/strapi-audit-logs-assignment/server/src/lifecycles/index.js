'use strict';

const _ = require('lodash');

module.exports =
  {
    async afterCreate(event)
    {
      try {
        const { result, model } = event;

        const ctx = strapi.requestContext.get();
        const user = ctx?.state?.user;

        await strapi.db
          .query('plugin::strapi-audit-logs-assignment.audit-log')
          .create
          (
            {
              data:
                {
                  contentType: model.uid,
                  recordId: result.id,
                  actionType: 'create',
                  timeStamp: new Date(),
                  user: user?.id || null,
                  changes: result
                },
            });
      }
      catch(error) {
        strapi.log.error('Audit log afterCreate error:', error);
      }
    },


    async beforeUpdate(event)
    {
      try{

      const { params, model } = event;

      const existingRecord = await strapi.db.query(model.uid).findOne({
        where: { id: params.where.id },
      });

      event.state = { oldRecord: existingRecord };
    }
    catch (error) {
  strapi.log.error('Audit log beforeUpdate error:', error);
  }
},

    async afterUpdate(event)
    {
      try {
        const { result, model, state } = event;

        const ctx = strapi.requestContext.get();
        const user = ctx?.state?.user;

        const changes = {};

        if (state?.oldRecord && result) {
          for (const key in result) {
            if (
              ['id', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy'].includes(
                key
              )
            ) {
              continue;
            }

            const oldValue = state.oldRecord[key];
            const newValue = result[key];

            if (!_.isEqual(oldValue, newValue)) {
              changes[key] = {
                old: oldValue,
                new: newValue,
              };
            }
          }
        }

           await strapi.db.query('plugin::strapi-audit-logs-assignment.audit-log')
          .create({
            data: {
              contentType: model.uid,
              recordId: result.id,
              actionType: 'update',
              timeStamp: new Date(),
              user: user?.id || null,
              changes: changes
            }
          });
        }
        catch(error)
        {
          strapi.log.error('Audit log AfterUpdate error:',  error );
        }
        },

        async afterDelete(event)
      {
        try {
          const {result, model} = event;

          const ctx = strapi.requestContext.get();
          const user = ctx?.state?.user;


          await strapi.db
            .query('plugin::strapi-audit-logs-assignment.audit-log')
            .create(
              {
                data: {
                  contentType: model.uid,
                  recordId: result.id,
                  actionType: 'delete',
                  timeStamp: new Date(),
                  user: user?.id || null,
                  changes: result
                },
              })
          }
          catch(error)
          {
             strapi.log.error('Audit log afterDelete error:', error);
          }
      }
    };

