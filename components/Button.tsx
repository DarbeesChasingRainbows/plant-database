import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  href?: string;
}

export function Button(props: ButtonProps) {
  const { primary, href, ...rest } = props;
  const className = `px-2 py-1 border-2 rounded transition-colors ${
    primary
      ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600"
      : "border-gray-500 bg-white hover:bg-gray-200"
  } ${props.class || ""}`;

  if (href) {
    return (
      <a
        href={href}
        class={className}
        {...rest}
      >
        {props.children}
      </a>
    );
  }

  return (
    <button
      {...rest}
      disabled={!IS_BROWSER || props.disabled}
      class={className}
    >
      {props.children}
    </button>
  );
}
