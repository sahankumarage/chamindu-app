// Minimal ambient types for Node's built-in SQLite module (node:sqlite),
// which isn't covered by the installed @types/node version.
declare module 'node:sqlite' {
    export interface StatementSync {
        run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
        get(...params: unknown[]): unknown;
        all(...params: unknown[]): unknown[];
    }

    export class DatabaseSync {
        constructor(path: string, options?: { readOnly?: boolean; open?: boolean });
        exec(sql: string): void;
        prepare(sql: string): StatementSync;
        close(): void;
    }
}
