interface LabelProps {
    labelColor: string;
    labelText: string;
}

export const Label = ({labelColor, labelText}: LabelProps) => {
  return (
    <p className={`w-max py-0.5 px-1 rounded label-text text-center ${labelColor}`}>
      {labelText}
    </p>
  );
};
