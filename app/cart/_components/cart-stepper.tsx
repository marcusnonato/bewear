import { Check } from "lucide-react";

interface CartStepperProps {
  currentStep: "identification" | "confirmation";
}

const CartStepper = ({ currentStep }: CartStepperProps) => {
  const steps = [
    { id: 1, label: "Sacola", completed: true },
    {
      id: 2,
      label: "Identificação",
      completed: currentStep === "confirmation",
      active: currentStep === "identification",
    },
    {
      id: 3,
      label: "Pagamento",
      completed: false,
      active: currentStep === "confirmation",
    },
  ];

  return (
    <div className="hidden items-center justify-center px-5 py-6 md:px-11 lg:flex">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step.completed
                  ? "border-primary bg-primary text-primary-foreground"
                  : step.active
                    ? "border-primary bg-background text-primary"
                    : "border-muted-foreground/30 bg-background text-muted-foreground"
              }`}
            >
              {step.completed ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-semibold">{step.id}</span>
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                step.active || step.completed
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`mx-4 h-0.5 w-32 md:w-40 ${
                steps[index + 1].completed || steps[index + 1].active
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CartStepper;
