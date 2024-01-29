interface LabelProps {
    labelColor: string;
    labelText: string;
}

export const Label = ({labelColor, labelText}: LabelProps) => {
  return (
    <p className={`w-max py-1 px-2 rounded label-text text-center ${labelColor}`}>
      {labelText}
    </p>
  );
};
