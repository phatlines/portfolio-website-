type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "primary" | "outline" | "ink" };

/** A link styled as a button. Primary takes the active project's colour; outline is a 1.5px ring. */
export function Button({ variant = "primary", className = "", ...rest }: Props) {
  return <a className={`btn btn-${variant} ${className}`} {...rest} />;
}
