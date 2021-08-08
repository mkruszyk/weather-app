import clsx from "clsx";
import {
  cloneElement,
  ComponentPropsWithoutRef,
  memo,
  ReactElement,
  ReactNode,
  useMemo,
} from "react";

type Props = ComponentPropsWithoutRef<"div"> & {
  icon?: ReactElement;
  name: string;
  units?: ReactNode;
  value: number;
};

function WeatherParam({
  className,
  icon,
  units,
  name,
  value,
  ...props
}: Props) {
  const modifiedIcon = useMemo(() => {
    if (icon) {
      return cloneElement(icon, {
        className: clsx(icon.props.className, "w-5 h-5"),
      });
    }

    return null;
  }, [icon]);

  return (
    <div
      className={clsx(
        className,
        "flex items-center text-lg justify-between border-b border-gray-300 mt-2 sm:mt-0  sm:border-b-0"
      )}
      {...props}
    >
      <div className="flex">
        {modifiedIcon}
        <p className="ml-2 text-sm text-gray-600">{name}</p>
      </div>
      <p className="ml-3">
        {Math.round(value)}
        {units}
      </p>
    </div>
  );
}

export default memo(WeatherParam);
