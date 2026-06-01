import { colors } from "../theme/color.theme";

type AuthHeaderProps = {
  subtitle: string;
  title: string;
};

const AuthHeader = ({ subtitle, title }: AuthHeaderProps) => (
  <div className="text-center">
    <h1 className="text-3xl font-bold" style={{ color: colors.title }}>
      {title}
    </h1>
    <p className="mt-7 text-base font-medium" style={{ color: colors.label }}>
      {subtitle}
    </p>
  </div>
);

export default AuthHeader;
