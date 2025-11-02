declare module "toml" {
  /**
   * Parse TOML string into an unknown value. Consumers should validate shape
   * at runtime (or use a type assertion) since TOML can represent arbitrary data.
   */
  export function parse(input: string): unknown;
}
