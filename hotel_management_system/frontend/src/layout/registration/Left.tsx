import { colors } from "../../theme/color.theme";

const Left = () => (
  <aside
    className="hidden h-[calc(100vh-48px)] rounded-[18px] lg:block"
    style={{ background: colors.primary }}
  />
);

export default Left;
