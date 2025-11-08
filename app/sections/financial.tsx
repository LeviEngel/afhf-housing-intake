import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// Define the source names and labels for easy iteration
const incomeSources = [
  { name: 'childSupport', label: 'child support' },
  { name: 'alimony', label: 'alimony' },
  { name: 'wages', label: 'wages' },
  { name: 'stipends', label: 'stipends' },
  { name: 'SSI', label: 'SSI' },
  { name: 'TCA', label: 'TCA' },
  { name: 'helpFromFamilyFriends', label: 'help from family/friends' },
  { name: 'Other', label: 'Other' },
] as const;

// Currency format regex: allows optional '$', commas, and optional two decimal places
const currencyRegex = /^\$?\s*\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$/;

// Zod Schema Definition
const formSchema = z.object({
  totalMonthlyIncome: z
    .string()
    .min(1, "Monthly household income is required.")
    .regex(currencyRegex, "Must be a valid currency format (e.g., 1,500.00)"),
  
  // Individual fields for RHF control and conditional watching
  childSupport_checked: z.boolean().default(false),
  childSupport_amount: z.string().optional(),
  
  alimony_checked: z.boolean().default(false),
  alimony_amount: z.string().optional(),

  wages_checked: z.boolean().default(false),
  wages_amount: z.string().optional(),

  stipends_checked: z.boolean().default(false),
  stipends_amount: z.string().optional(),

  SSI_checked: z.boolean().default(false),
  SSI_amount: z.string().optional(),

  TCA_checked: z.boolean().default(false),
  TCA_amount: z.string().optional(),

  helpFromFamilyFriends_checked: z.boolean().default(false),
  helpFromFamilyFriends_amount: z.string().optional(),

  Other_checked: z.boolean().default(false),
  Other_amount: z.string().optional(),
}).superRefine((data, ctx) => {
  // --- Conditional Validation for Income Sources ---
  
  incomeSources.forEach(({ name, label }) => {
    const isChecked = data[`${name}_checked` as keyof typeof data] as boolean;
    const amount = data[`${name}_amount` as keyof typeof data] as string | undefined;

    if (isChecked) {
      if (!amount || amount.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Amount for ${label} is required.`,
          path: [`${name}_amount`],
        });
      } else if (!currencyRegex.test(amount)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a valid currency amount.',
          path: [`${name}_amount`],
        });
      }
    }
  });
});

type FinancialFormData = z.infer<typeof formSchema>

export default function Financial() {
  const form = useForm<FinancialFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalMonthlyIncome: "",
    },
    mode: "onBlur"
  })

  const { formState: { errors } } = form;
  
  // Watch all the checkbox states to conditionally render amount inputs
  const watchFields = incomeSources.map(source => `${source.name}_checked`);
  const watchedValues = form.watch(watchFields as any) as boolean[];

  const isChecked = (name: string): boolean => {
    const index = incomeSources.findIndex(s => s.name === name);
    return watchedValues[index] ?? form.getValues(`${name}_checked` as keyof FinancialFormData);
  }

  function onSubmit(data: FinancialFormData) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Financial Information</CardTitle>
        <CardDescription>
          Please provide details regarding your household's monthly income.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-financial" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-6">

            {/* 1. TOTAL MONTHLY INCOME */}
            <Field>
              <FieldLabel htmlFor="totalMonthlyIncome">
                What is your current monthly household income for ALL household members?
              </FieldLabel>
              <Input
                {...form.register("totalMonthlyIncome")}
                id="totalMonthlyIncome"
                placeholder="$"
              />
              {errors.totalMonthlyIncome && <FieldError errors={[{ message: errors.totalMonthlyIncome?.message }]} />}
            </Field>

            {/* 2. INCOME SOURCES */}
            <Field className="space-y-3">
              <FieldLabel>From what sources?:</FieldLabel>
              
              <div className="space-y-4">
                {incomeSources.map(({ name, label }) => {
                  const checkedFieldName = `${name}_checked` as const;
                  const amountFieldName = `${name}_amount` as const;
                  const isSourceChecked = isChecked(name);
                  
                  return (
                    <div key={name} className="flex flex-col gap-2">
                        {/* Checkbox and Label */}
                        <Controller
                            name={checkedFieldName}
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    {/* Use Checkbox from UI Library */}
                                    <Checkbox
                                        id={checkedFieldName}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <FieldLabel htmlFor={checkedFieldName} className="cursor-pointer">
                                        {label}
                                    </FieldLabel>
                                </div>
                            )}
                        />

                        {/* Conditional Amount Input */}
                        {isSourceChecked && (
                            <Field className="ml-6 flex-1 w-auto">
                                <div className="flex items-center gap-2">
                                    <FieldLabel htmlFor={amountFieldName} className="sr-only">Amount for {label}</FieldLabel>
                                    <span className="text-sm font-medium">$</span>
                                    <Input 
                                        {...form.register(amountFieldName)}
                                        id={amountFieldName}
                                        placeholder="Amount"
                                        className="w-full"
                                    />
                                </div>
                                {errors[amountFieldName] && <FieldError errors={[{ message: errors[amountFieldName]?.message }]} />}
                            </Field>
                        )}
                    </div>
                  );
                })}
              </div>
            </Field>

          </FieldGroup>
        </form>
      </CardContent>      
    </Card>
  )
}