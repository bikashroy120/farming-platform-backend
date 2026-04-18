import { z } from 'zod';
import { registry, createSuccessResponse } from '../../../lib/openapi';

const PlantUpdateSchema = z.object({
  id: z.string().uuid(),
  updateMsg: z.string().openapi({ example: 'Added organic fertilizer today.' }),
  health: z.string().openapi({ example: 'Good' }),
  createdAt: z.string(),
});

export const PlantWithDetailsSchema = registry.register(
  'Plant',
  z.object({
    id: z.string().uuid(),
    userId: z.string(),
    name: z.string().openapi({ example: 'Cherry Tomato' }),
    growthStage: z.string().openapi({ example: 'Flowering' }),
    healthStatus: z.string().openapi({ example: 'Healthy' }),
    plantedAt: z.string(),
    harvestAt: z.string().nullable(),
    createdAt: z.string(),
    plantUpdates: z.array(PlantUpdateSchema).optional(),
  }),
);

export const plantSwagger = () => {
  registry.registerPath({
    method: 'get',
    path: '/socket-events',
    summary: 'Documentation for Socket.io Events',
    description: `
### 🔌 Socket.io Real-time Integration
Connect to the socket server at the base URL. Authentication via JWT is required in the handshake.

#### 🟢 Client-to-Server (Emit)
1. **\`join-plant\`**: Subscribe to a specific plant room.
   - **Payload**: \`plantId (string)\`
2. **\`leave-plant\`**: Unsubscribe from a specific plant room.
   - **Payload**: \`plantId (string)\`

#### 🔴 Server-to-Client (Listen)
1. **\`plant-status-updated\`**: Triggered when a new health record is added.
   - **Payload**:
   \`\`\`json
   {
     "event": "NEW_HEALTH_UPDATE",
     "plantId": "uuid",
     "data": {
       "health": "Healthy",
       "growthStage": "Harvest-Ready",
       "updateMsg": "Ready to harvest!",
       "updatedAt": "timestamp"
     }
   }
   \`\`\`
    `,
    tags: ['Real-time Updates'],
    responses: {
      200: { description: 'Success' },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/plants',
    summary: 'Register a new plant in the garden',
    tags: ['Plants'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string(),
              growthStage: z.string(),
              healthStatus: z.string(),
              plantedAt: z.string().datetime(),
              harvestAt: z.string().datetime().optional(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Plant registered successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(PlantWithDetailsSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/plants/{id}/update-health',
    summary: 'Update plant health and growth status',
    description:
      'Updates the health status and creates a record in PlantUpdate history. **Triggers "plant-status-updated" socket event.**',
    tags: ['Plants'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              healthStatus: z.string(),
              updateMsg: z.string(),
              growthStage: z.string().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Health status updated',
        content: {
          'application/json': {
            schema: createSuccessResponse(PlantWithDetailsSchema),
          },
        },
      },
    },
  });

  // --- 4. Get plant details ---
  registry.registerPath({
    method: 'get',
    path: '/plants/{id}',
    summary: 'Get plant details with update history',
    tags: ['Plants'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessResponse(PlantWithDetailsSchema),
          },
        },
      },
    },
  });
};
