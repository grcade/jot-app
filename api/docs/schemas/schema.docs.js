/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-03-20T11:20:00.000Z
 *
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 660e8400-e29b-41d4-a716-446655440111
 *         title:
 *           type: string
 *           example: Project plan
 *         desc:
 *           type: string
 *           example: Finalize milestones and timelines
 *         bg:
 *           type: string
 *           nullable: true
 *           example: '#FDF5E6'
 *         color:
 *           type: string
 *           nullable: true
 *           example: '#FF6B6B'
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-03-20T10:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-03-20T10:30:00.000Z
 *
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 770e8400-e29b-41d4-a716-446655440222
 *         taskDesc:
 *           type: string
 *           example: Complete API docs
 *         priority:
 *           type: string
 *           nullable: true
 *           enum: [low, medium, high]
 *           example: high
 *         deadline:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-03-22T17:00:00.000Z
 *         status:
 *           type: string
 *           enum: [pending, completed, in-progress]
 *           example: pending
 *         noteId:
 *           type: string
 *           format: uuid
 *           example: 660e8400-e29b-41d4-a716-446655440111
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-03-20T10:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-03-20T11:00:00.000Z
 *
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 880e8400-e29b-41d4-a716-446655440333
 *         name:
 *           type: string
 *           example: important
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *
 *     RegisterRequest:
 *       type: object
 *       required: [email, password]
 *       example:
 *         email: user@example.com
 *         password: SecurePassword123!
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePassword123!
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User registered successfully
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       example:
 *         email: user@example.com
 *         password: SecurePassword123!
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePassword123!
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Login successful
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature
 *         success:
 *           type: boolean
 *           example: true
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User logged out successfully
 *         success:
 *           type: boolean
 *           example: true
 *
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User profile fetched successfully
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: user@example.com
 *
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Token refreshed successfully
 *         success:
 *           type: boolean
 *           example: true
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.newpayload.signature
 *
 *     CreateNoteRequest:
 *       type: object
 *       required: [title]
 *       example:
 *         title: Sprint planning
 *         description: Plan sprint goals and tasks
 *         color: '#FF6B6B'
 *       properties:
 *         title:
 *           type: string
 *           example: Sprint planning
 *         description:
 *           type: string
 *           example: Plan sprint goals and tasks
 *         color:
 *           type: string
 *           nullable: true
 *           example: '#FF6B6B'
 *
 *     UpdateNoteRequest:
 *       type: object
 *       example:
 *         title: Updated sprint planning
 *         description: Added backlog and priorities
 *         bg: '#FFF8DC'
 *       properties:
 *         title:
 *           type: string
 *           example: Updated sprint planning
 *         description:
 *           type: string
 *           example: Added backlog and priorities
 *         bg:
 *           type: string
 *           nullable: true
 *           example: '#FFF8DC'
 *
 *     NoteResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Note created successfully
 *         success:
 *           type: boolean
 *           example: true
 *         note:
 *           $ref: '#/components/schemas/Note'
 *
 *     NotesResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Reterived all notes successfully
 *         success:
 *           type: boolean
 *           example: true
 *         notes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Note'
 *
 *     AddTagRequest:
 *       type: object
 *       required: [tagName]
 *       example:
 *         tagName: urgent
 *       properties:
 *         tagName:
 *           type: string
 *           example: urgent
 *
 *     RemoveTagRequest:
 *       type: object
 *       required: [tagId]
 *       example:
 *         tagId: 880e8400-e29b-41d4-a716-446655440333
 *       properties:
 *         tagId:
 *           type: string
 *           format: uuid
 *           example: 880e8400-e29b-41d4-a716-446655440333
 *
 *     TagActionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Tag added to note successfully
 *         success:
 *           type: boolean
 *           example: true
 *         tag:
 *           oneOf:
 *             - $ref: '#/components/schemas/Tag'
 *             - type: object
 *
 *     TagsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Retrieved all tags successfully
 *         success:
 *           type: boolean
 *           example: true
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *
 *     CreateTaskRequest:
 *       type: object
 *       required: [taskDesc]
 *       example:
 *         taskDesc: Complete API documentation
 *         priority: high
 *         deadline: 2026-03-22T17:00:00.000Z
 *         status: pending
 *       properties:
 *         taskDesc:
 *           type: string
 *           example: Complete API documentation
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           nullable: true
 *           example: high
 *         deadline:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-03-22T17:00:00.000Z
 *         status:
 *           type: string
 *           enum: [pending, completed, in-progress]
 *           example: pending
 *
 *     UpdateTaskRequest:
 *       type: object
 *       example:
 *         taskDesc: Complete comprehensive API documentation
 *         priority: medium
 *         deadline: 2026-03-24T17:00:00.000Z
 *       properties:
 *         taskDesc:
 *           type: string
 *           example: Complete comprehensive API documentation
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           nullable: true
 *           example: medium
 *         deadline:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-03-24T17:00:00.000Z
 *
 *     UpdateTaskStatusRequest:
 *       type: object
 *       required: [status]
 *       example:
 *         status: completed
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, completed, in-progress]
 *           example: completed
 *
 *     TaskResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Task retrieved successfully
 *         task:
 *           $ref: '#/components/schemas/Task'
 *
 *     TasksResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: All tasks retrieved successfully
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Internal server error
 *         success:
 *           type: boolean
 *           example: false
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Operation completed successfully
 *         success:
 *           type: boolean
 *           example: true
 */
