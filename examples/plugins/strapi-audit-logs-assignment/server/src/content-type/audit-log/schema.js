module.exports =
  {
      kind : 'CollectionType',
      collectionName : 'audit_logs',
      info:
        {
          singularName : 'audit-log',
          pluralName : 'audit-logs',
          displayName : 'Audit Log',
        },

    options:
      {
        draftAndPublish : false,
      },
    attributes:
      {
        contentType:
          {
            type : 'string',
            required : true
          },
        recordId:
          {
            type : 'string',
            required : true
          },
        actionType:
          {
            type : 'enumeration',
            enum : ['create', 'update', 'delete'],
            required : true
          },
        timeStamp:
          {
            type : 'datetime',
            required : true
          },
        user:
          {
            type : 'relation',
            relation : 'oneToOne',
            target : 'plugin::users-permissions.user'
          },
        changes:
          {
            type : 'json'
          }
      },

    indexes: [
      {
        name: 'idx_content_type',
        columns: ['contentType']
      },
      {
        name: 'idx_action_type',
        columns: ['actionType']
      },
      {
        name: 'idx_timestamp',
        columns: ['timeStamp']
      },
      {
        name: 'idx_user',
        columns: ['user']
      },

      {
        name: 'idx_content_type_timestamp',
        columns: ['contentType', 'timeStamp']
      },
      {
        name: 'idx_user_timestamp',
        columns: ['user', 'timeStamp']
      }
    ]
  };
