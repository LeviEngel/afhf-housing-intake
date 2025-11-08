"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Zod Schema Definition
const formSchema = z.object({
  hasSubstanceHistory: z.enum(["Yes", "No"], {
    required_error: "A selection is required.",
  }),
  substances: z.string().optional(),
  lastUseMonth: z.string().optional(),
  lastUseYear: z.string().optional(),
  isCleanAndSober: z.enum(["Yes", "No"], {
    required_error: "A selection is required.",
  }),
  sobrietyPlan: z.string().optional(),
  hasInpatientTreatment: z.enum(["Yes", "No"], {
    required_error: "A selection is required.",
  }),
  inpatientDetails: z.string().optional(),
  hasSponsor: z.enum(["Yes", "No"], {
    required_error: "A selection is required.",
  }),
}).superRefine((data, ctx) => {
  // --- Conditional Validation for Substance History ---
  if (data.hasSubstanceHistory === 'Yes') {
    if (!data.substances || data.substances.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please list the substance(s).',
        path: ['substances'],
      });
    }
    if (!data.lastUseMonth || data.lastUseMonth.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Month is required.',
        path: ['lastUseMonth'],
      });
    }
    if (!data.lastUseYear || data.lastUseYear.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Year is required.',
        path: ['lastUseYear'],
      });
    }
  }

  // --- Conditional Validation for In-patient Treatment ---
  if (data.hasInpatientTreatment === 'Yes') {
    if (!data.inpatientDetails || data.inpatientDetails.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide when and where treatment occurred.',
        path: ['inpatientDetails'],
      });
    }
  }
  
  // --- Conditional Validation for Sobriety Plan ---
  if (data.isCleanAndSober === 'Yes') {
    if (!data.sobrietyPlan || data.sobrietyPlan.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe your plan to stay clean and sober.',
        path: ['sobrietyPlan'],
      });
    }
  }
});

type SubstanceUseHistoryFormData = z.infer<typeof formSchema>

export default function SubstanceUseHistory() {
  const form = useForm<SubstanceUseHistoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasSubstanceHistory: "No",
      isCleanAndSober: "No",
      hasInpatientTreatment: "No",
      hasSponsor: "No",
    },
    mode: "onBlur"
  })

  // Watchers for conditional rendering
  const hasHistory = form.watch("hasSubstanceHistory")
  const hasTreatment = form.watch("hasInpatientTreatment")
  const isSober = form.watch("isCleanAndSober")
  
  // RHF registration helper
  const { register, formState: { errors } } = form;


  function onSubmit(data: SubstanceUseHistoryFormData) {
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

  // Helper for rendering a standard Yes/No Radio Group
  const renderRadioGroup = (name: keyof SubstanceUseHistoryFormData, label: string) => (
    <Field className="space-y-3">
        <FieldLabel>{label}</FieldLabel>
        <RadioGroup
            onValueChange={(value: "Yes" | "No") => form.setValue(name, value, { shouldValidate: true })}
            defaultValue={form.watch(name) as "Yes" | "No"}
            className="flex space-x-4"
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id={`${name}-yes`} />
                <FieldLabel htmlFor={`${name}-yes`}>Yes</FieldLabel>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id={`${name}-no`} />
                <FieldLabel htmlFor={`${name}-no`}>No</FieldLabel>
            </div>
        </RadioGroup>
        {errors[name] && <FieldError errors={[{ message: errors[name]?.message }]} />}
    </Field>
  );

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Substance Use History</CardTitle>
        <CardDescription>
          Please provide accurate information regarding your substance use history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-substance-use" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-6">

            {/* 1. HISTORY OF ABUSING DRUGS/ALCOHOL */}
            {renderRadioGroup("hasSubstanceHistory", "Do you have a history of abusing drugs and/or alcohol?")}

            {/* CONDITIONAL FIELDS: IF HAS HISTORY IS 'YES' */}
            {hasHistory === 'Yes' && (
              <div className="space-y-4 p-3 border-l-2 border-slate-200">
                {/* 1a. SUBSTANCE(S) */}
                <Field>
                  <FieldLabel htmlFor="substances">What substance(s)?</FieldLabel>
                  <Input 
                    {...register("substances")}
                    id="substances"
                    placeholder="e.g., Alcohol, Cannabis, Opioids"
                  />
                  {errors.substances && <FieldError errors={[{ message: errors.substances?.message }]} />}
                </Field>

                {/* 1b. LAST TIME USED */}
                <Field>
                  <FieldLabel>When was the last time you used this substance?</FieldLabel>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input 
                        {...register("lastUseMonth")}
                        id="lastUseMonth"
                        placeholder="Month (e.g., January)"
                      />
                      {errors.lastUseMonth && <FieldError errors={[{ message: errors.lastUseMonth?.message }]} />}
                    </div>
                    <div className="flex-1">
                      <Input 
                        {...register("lastUseYear", { minLength: 4, maxLength: 4 })}
                        id="lastUseYear"
                        placeholder="Year (e.g., 2023)"
                        type="number"
                      />
                      {errors.lastUseYear && <FieldError errors={[{ message: errors.lastUseYear?.message }]} />}
                    </div>
                  </div>
                </Field>
              </div>
            )}

            {/* 2. CURRENTLY DRUG AND ALCOHOL FREE */}
            {renderRadioGroup("isCleanAndSober", "Are you currently drug and alcohol free?")}

            {/* CONDITIONAL FIELD: IF CLEAN AND SOBER IS 'YES' */}
            {isSober === 'Yes' && (
              <div className="space-y-4 p-3 border-l-2 border-slate-200">
                {/* 2a. SOBRIETY PLAN */}
                <Field>
                  <FieldLabel htmlFor="sobrietyPlan">What are you doing to stay clean and sober?</FieldLabel>
                  <Input 
                    {...register("sobrietyPlan")}
                    id="sobrietyPlan"
                    placeholder="e.g., Attending AA meetings, therapy, etc."
                  />
                  {errors.sobrietyPlan && <FieldError errors={[{ message: errors.sobrietyPlan?.message }]} />}
                </Field>
              </div>
            )}
            
            {/* 3. IN-PATIENT TREATMENT */}
            {renderRadioGroup("hasInpatientTreatment", "Have you ever participated in in-patient treatment?")}
            
            {/* CONDITIONAL FIELD: IF HAS INPATIENT TREATMENT IS 'YES' */}
            {hasTreatment === 'Yes' && (
              <div className="space-y-4 p-3 border-l-2 border-slate-200">
                {/* 3a. IN-PATIENT DETAILS */}
                <Field>
                  <FieldLabel htmlFor="inpatientDetails">If yes, when and where?</FieldLabel>
                  <Input 
                    {...register("inpatientDetails")}
                    id="inpatientDetails"
                    placeholder="e.g., 2020 at Hazelden Betty Ford"
                  />
                  {errors.inpatientDetails && <FieldError errors={[{ message: errors.inpatientDetails?.message }]} />}
                </Field>
              </div>
            )}
            
            {/* 4. HAS SPONSOR */}
            {renderRadioGroup("hasSponsor", "Do you have a sponsor?")}

          </FieldGroup>
        </form>
      </CardContent>      
    </Card>
  )
}