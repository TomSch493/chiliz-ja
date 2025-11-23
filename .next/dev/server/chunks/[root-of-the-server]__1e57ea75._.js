module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Prisma Client Singleton
 * Ensures a single instance of PrismaClient is used across the application
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'error',
        'warn'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Authentication Helper Functions
 * Handles wallet-based authentication with JWT sessions
 */ __turbopack_context__.s([
    "cleanupExpiredSessions",
    ()=>cleanupExpiredSessions,
    "createAuthMessage",
    ()=>createAuthMessage,
    "createSession",
    ()=>createSession,
    "createSessionToken",
    ()=>createSessionToken,
    "destroySession",
    ()=>destroySession,
    "generateNonce",
    ()=>generateNonce,
    "getCurrentUser",
    ()=>getCurrentUser,
    "requireAuth",
    ()=>requireAuth,
    "verifySessionToken",
    ()=>verifySessionToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
;
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET_IN_PRODUCTION';
const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_DURATION_DAYS = 7;
function generateNonce() {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString('hex');
}
function createAuthMessage(nonce, address) {
    return `Sign this message to authenticate with your wallet.

Address: ${address}
Nonce: ${nonce}

This request will not trigger a blockchain transaction or cost any gas fees.`;
}
function createSessionToken(userId) {
    const expiresIn = `${SESSION_DURATION_DAYS}d`;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        userId
    }, JWT_SECRET, {
        expiresIn
    });
}
function verifySessionToken(token) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}
async function createSession(userId) {
    const token = createSessionToken(userId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.create({
        data: {
            userId,
            token,
            expiresAt
        }
    });
    // Set HTTP-only cookie
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
        path: '/'
    });
    return token;
}
async function getCurrentUser() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        if (!sessionToken) {
            return null;
        }
        // Verify JWT
        const decoded = verifySessionToken(sessionToken);
        if (!decoded) {
            return null;
        }
        // Find session in DB
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.findUnique({
            where: {
                token: sessionToken
            },
            include: {
                user: true
            }
        });
        if (!session) {
            return null;
        }
        // Check if session expired
        if (session.expiresAt < new Date()) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.delete({
                where: {
                    id: session.id
                }
            });
            return null;
        }
        return session.user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}
async function destroySession() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        if (sessionToken) {
            // Delete from database
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.deleteMany({
                where: {
                    token: sessionToken
                }
            });
        }
        // Clear cookie
        cookieStore.delete(SESSION_COOKIE_NAME);
    } catch (error) {
        console.error('Error destroying session:', error);
    }
}
async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized - Please connect your wallet');
    }
    return user;
}
async function cleanupExpiredSessions() {
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    });
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/lib/ethers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Ethereum / Blockchain Helper Functions
 * Provides ethers.js utilities for interacting with smart contracts
 */ __turbopack_context__.s([
    "getChzTokenContract",
    ()=>getChzTokenContract,
    "getPaymentContract",
    ()=>getPaymentContract,
    "getProvider",
    ()=>getProvider,
    "getStakedAmount",
    ()=>getStakedAmount,
    "getStakingContract",
    ()=>getStakingContract,
    "isValidAddress",
    ()=>isValidAddress,
    "verifyPaymentTransaction",
    ()=>verifyPaymentTransaction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$6$2e$15$2e$0$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ethers@6.15.0/node_modules/ethers/lib.esm/ethers.js [app-route] (ecmascript) <export * as ethers>");
;
// Initialize provider for reading blockchain data
let provider = null;
function getProvider() {
    if (!provider) {
        const rpcUrl = process.env.CHAIN_RPC_URL;
        if (!rpcUrl) {
            throw new Error('CHAIN_RPC_URL environment variable is not set');
        }
        provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$6$2e$15$2e$0$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].JsonRpcProvider(rpcUrl);
    }
    return provider;
}
// ERC20 Token ABI (minimal interface for CHZ token)
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) returns (bool)'
];
// Payment Contract ABI
const PAYMENT_CONTRACT_ABI = [
    'event PaymentDone(address indexed payer, uint256 amount)',
    'function pay() external',
    'function fixedAmount() view returns (uint256)',
    'function wallet1() view returns (address)',
    'function wallet2() view returns (address)'
];
// Staking Contract ABI (minimal interface)
const STAKING_CONTRACT_ABI = [
    'function stakedBalanceOf(address user) external view returns (uint256)'
];
function getChzTokenContract() {
    const tokenAddress = process.env.CHZ_TOKEN_ADDRESS;
    if (!tokenAddress) {
        throw new Error('CHZ_TOKEN_ADDRESS environment variable is not set');
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$6$2e$15$2e$0$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(tokenAddress, ERC20_ABI, getProvider());
}
function getPaymentContract() {
    const contractAddress = process.env.PAYMENT_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('PAYMENT_CONTRACT_ADDRESS environment variable is not set');
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$6$2e$15$2e$0$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(contractAddress, PAYMENT_CONTRACT_ABI, getProvider());
}
function getStakingContract() {
    const contractAddress = process.env.STAKING_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('STAKING_CONTRACT_ADDRESS environment variable is not set');
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$6$2e$15$2e$0$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(contractAddress, STAKING_CONTRACT_ABI, getProvider());
}
async function getStakedAmount(userAddress) {
    try {
        const stakingContract = getStakingContract();
        const stakedBalance = await stakingContract.stakedBalanceOf(userAddress);
        return BigInt(stakedBalance.toString());
    } catch (error) {
        console.error('Error fetching staked amount:', error);
        throw new Error('Failed to fetch staked amount from blockchain');
    }
}
async function verifyPaymentTransaction(txHash) {
    try {
        const provider = getProvider();
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            return {
                valid: false,
                error: 'Transaction not found'
            };
        }
        // Check if transaction succeeded
        if (receipt.status !== 1) {
            return {
                valid: false,
                error: 'Transaction failed'
            };
        }
        // Verify the transaction was sent to the payment contract
        const paymentContractAddress = process.env.PAYMENT_CONTRACT_ADDRESS?.toLowerCase();
        if (receipt.to?.toLowerCase() !== paymentContractAddress) {
            return {
                valid: false,
                error: 'Transaction not sent to payment contract'
            };
        }
        // Try to decode the PaymentDone event
        const paymentContract = getPaymentContract();
        let paymentAmount = '0';
        let payerAddress = '';
        for (const log of receipt.logs){
            try {
                const parsedLog = paymentContract.interface.parseLog({
                    topics: [
                        ...log.topics
                    ],
                    data: log.data
                });
                if (parsedLog?.name === 'PaymentDone') {
                    payerAddress = parsedLog.args.payer;
                    paymentAmount = parsedLog.args.amount.toString();
                    break;
                }
            } catch (e) {
                continue;
            }
        }
        return {
            valid: true,
            receipt,
            payerAddress,
            paymentAmount
        };
    } catch (error) {
        console.error('Error verifying transaction:', error);
        throw new Error('Failed to verify transaction');
    }
}
function isValidAddress(address) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$6$2e$15$2e$0$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].isAddress(address);
}
}),
"[project]/app/api/payment/confirm/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * POST /api/payment/confirm
 * Verify and record a payment transaction
 */ __turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ethers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ethers.ts [app-route] (ecmascript)");
;
;
;
;
;
const RequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    txHash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
});
async function POST(request) {
    try {
        // Require authentication
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])();
        const body = await request.json();
        const { txHash } = RequestSchema.parse(body);
        // Check if payment already exists
        const existingPayment = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.findUnique({
            where: {
                txHash
            }
        });
        if (existingPayment) {
            if (existingPayment.status === 'CONFIRMED') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    status: 'CONFIRMED',
                    message: 'Payment already confirmed'
                });
            }
        // If pending or failed, we'll re-verify
        }
        // Verify the transaction on-chain
        const verification = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ethers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPaymentTransaction"])(txHash);
        if (!verification.valid) {
            // Update or create payment record as FAILED
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.upsert({
                where: {
                    txHash
                },
                update: {
                    status: 'FAILED',
                    updatedAt: new Date()
                },
                create: {
                    userId: user.id,
                    txHash,
                    amount: '0',
                    status: 'FAILED'
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: verification.error || 'Transaction verification failed'
            }, {
                status: 400
            });
        }
        // Verify the payer matches the authenticated user
        if (verification.payerAddress && verification.payerAddress.toLowerCase() !== user.address.toLowerCase()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Transaction payer does not match authenticated user'
            }, {
                status: 403
            });
        }
        // Create or update payment record as CONFIRMED
        const payment = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.upsert({
            where: {
                txHash
            },
            update: {
                status: 'CONFIRMED',
                amount: verification.paymentAmount || '0',
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                txHash,
                amount: verification.paymentAmount || '0',
                status: 'CONFIRMED'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            status: 'CONFIRMED',
            payment: {
                id: payment.id,
                txHash: payment.txHash,
                amount: payment.amount,
                createdAt: payment.createdAt
            }
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized - Please connect your wallet'
            }, {
                status: 401
            });
        }
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid request data',
                details: error.errors
            }, {
                status: 400
            });
        }
        console.error('Error confirming payment:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1e57ea75._.js.map