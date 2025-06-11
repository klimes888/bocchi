// styled.d.ts
import "styled-components";
import { theme } from "./lib/styled-theme";

type ThemeType = typeof theme;

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
