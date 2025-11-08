"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useFieldArray } from "react-hook-form"
import { useEffect } from "react"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  hasChronicIllness: z.boolean(),
  chronicIllnesses: z.array(
    z.object({
      type: z.string().min(1, "Type of illness is required"),
      symptoms: z.string().min(1, "Symptoms are required"),
      doctor: z.string().min(1, "Doctor name is required"),
      medication: z.string().min(1, "Medication details are required"),
      takingMedsAsPrescribed: z.boolean(),
      isManageable: z.boolean(),
    })
  ).optional(),
  hasPhysicalDisabilities: z.boolean(),
  physicalDisabilitiesExplanation: z.string().optional(),
  hasHealthInsurance: z.boolean(),
  healthInsuranceType: z.string().optional(),
  healthInsuranceCoverage: z.object({
    spouse: z.boolean().optional(),
    children: z.boolean().optional(),
  }).optional(),
  hasDentalInsurance: z.boolean(),
  dentalExamLastYear: z.boolean(),
  dentalInsuranceCoverage: z.object({
    spouse: z.boolean().optional(),
    children: z.boolean().optional(),
  }).optional(),
  hasRegularFamilyDoctor: z.boolean(),
  lastDoctorAppointment: z.object({
    month: z.string().optional(),
    year: z.string().optional(),
  }).optional(),
  lastObGynExam: z.object({
    month: z.string().optional(),
    year: z.string().optional(),
  }).optional(),
  mammogramStatus: z.enum(["yes", "no", "not-applicable"]).optional(),
  lastMammogram: z.object({
    month: z.string().optional(),
    year: z.string().optional(),
  }).optional(),
  hasMentalIllness: z.boolean(),
  receivingMentalHealthTreatment: z.boolean().optional(),
  mentalHealthTreatmentExplanation: z.string().optional(),
})

export default function Health() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasChronicIllness: false,
      chronicIllnesses: [],
      hasPhysicalDisabilities: false,
      physicalDisabilitiesExplanation: "",
      hasHealthInsurance: false,
      healthInsuranceType: "",
      healthInsuranceCoverage: { spouse: false, children: false },
      hasDentalInsurance: false,
      dentalExamLastYear: false,
      dentalInsuranceCoverage: { spouse: false, children: false },
      hasRegularFamilyDoctor: false,
      lastDoctorAppointment: { month: "", year: "" },
      lastObGynExam: { month: "", year: "" },
      mammogramStatus: "not-applicable",
      lastMammogram: { month: "", year: "" },
      hasMentalIllness: false,
      receivingMentalHealthTreatment: false,
      mentalHealthTreatmentExplanation: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chronicIllnesses",
  })

  const watchHasChronicIllness = form.watch("hasChronicIllness")
  const watchHasHealthInsurance = form.watch("hasHealthInsurance")
  const watchHasDentalInsurance = form.watch("hasDentalInsurance")
  const watchMammogramStatus = form.watch("mammogramStatus")
  const watchHasMentalIllness = form.watch("hasMentalIllness")

  // Add initial chronic illness entry when "Yes" is selected
  useEffect(() => {
    if (watchHasChronicIllness && fields.length === 0) {
      append({
        type: "",
        symptoms: "",
        doctor: "",
        medication: "",
        takingMedsAsPrescribed: false,
        isManageable: false,
      })
    }
  }, [watchHasChronicIllness, fields.length, append])

  function onSubmit(data: z.infer<typeof formSchema>) {
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
        "--border-radius": "calc(var(--radius) + 4px)",
      } as React.CSSProperties,
    })
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString())

  return (
    <Card className="w-full max-w-full sm:max-w-2xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Physical/Mental Health</CardTitle>
        <CardDescription className="text-sm">
          Please provide information about your health and medical history.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form id="form-health" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-6">
            
            {/* Chronic Illness Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Chronic Illness</h3>
              
              <Controller
                name="hasChronicIllness"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-sm font-medium">
                      Do you have a chronic illness?
                    </FieldLabel>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="h-4 w-4"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="h-4 w-4"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </Field>
                )}
              />

              {watchHasChronicIllness && (
                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Chronic Illness {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <Controller
                        name={`chronicIllnesses.${index}.type`}
                        control={form.control}
                        render={({ field: controllerField, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Type of chronic illness</FieldLabel>
                            <Input
                              {...controllerField}
                              placeholder="e.g., Diabetes, Hypertension"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name={`chronicIllnesses.${index}.symptoms`}
                        control={form.control}
                        render={({ field: controllerField, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>What are your symptoms?</FieldLabel>
                            <Textarea
                              {...controllerField}
                              placeholder="Describe your symptoms"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name={`chronicIllnesses.${index}.doctor`}
                        control={form.control}
                        render={({ field: controllerField, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Name of medical professional treating this illness</FieldLabel>
                            <Input
                              {...controllerField}
                              placeholder="Doctor's name"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name={`chronicIllnesses.${index}.medication`}
                        control={form.control}
                        render={({ field: controllerField, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Name and dosage of prescription</FieldLabel>
                            <Input
                              {...controllerField}
                              placeholder="e.g., Metformin 500mg twice daily"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name={`chronicIllnesses.${index}.takingMedsAsPrescribed`}
                        control={form.control}
                        render={({ field: controllerField }) => (
                          <Field>
                            <FieldLabel>Are you taking meds as prescribed?</FieldLabel>
                            <div className="flex gap-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={controllerField.value === true}
                                  onChange={() => controllerField.onChange(true)}
                                  className="h-4 w-4"
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={controllerField.value === false}
                                  onChange={() => controllerField.onChange(false)}
                                  className="h-4 w-4"
                                />
                                <span>No</span>
                              </label>
                            </div>
                          </Field>
                        )}
                      />

                      <Controller
                        name={`chronicIllnesses.${index}.isManageable`}
                        control={form.control}
                        render={({ field: controllerField }) => (
                          <Field>
                            <FieldLabel>Is the condition currently manageable?</FieldLabel>
                            <div className="flex gap-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={controllerField.value === true}
                                  onChange={() => controllerField.onChange(true)}
                                  className="h-4 w-4"
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={controllerField.value === false}
                                  onChange={() => controllerField.onChange(false)}
                                  className="h-4 w-4"
                                />
                                <span>No</span>
                              </label>
                            </div>
                          </Field>
                        )}
                      />
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                      type: "",
                      symptoms: "",
                      doctor: "",
                      medication: "",
                      takingMedsAsPrescribed: false,
                      isManageable: false,
                    })}
                    className="w-full sm:w-auto"
                  >
                    Add Another Chronic Illness
                  </Button>
                </div>
              )}


            </div>

            {/* Physical Disabilities */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Physical Disabilities</h3>
              
              <Controller
                name="hasPhysicalDisabilities"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Do you have any physical disabilities?</FieldLabel>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="h-4 w-4"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="h-4 w-4"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </Field>
                )}
              />

              {form.watch("hasPhysicalDisabilities") && (
                <Controller
                  name="physicalDisabilitiesExplanation"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Please explain:</FieldLabel>
                      <Textarea
                        {...field}
                        placeholder="Describe your physical disabilities"
                      />
                    </Field>
                  )}
                />
              )}
            </div>

            {/* Health Insurance */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Health Insurance</h3>
              
              <Controller
                name="hasHealthInsurance"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Do you currently have health insurance?</FieldLabel>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="h-4 w-4"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="h-4 w-4"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </Field>
                )}
              />

              {watchHasHealthInsurance && (
                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                  <Controller
                    name="healthInsuranceType"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Type:</FieldLabel>
                        <Input
                          {...field}
                          placeholder="e.g., Medicaid, Private, Employer-provided"
                        />
                      </Field>
                    )}
                  />

                  <Field>
                    <FieldLabel>If yes, who is covered in addition to you?</FieldLabel>
                    <div className="space-y-2">
                      <Controller
                        name="healthInsuranceCoverage.spouse"
                        control={form.control}
                        render={({ field }) => (
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span>Spouse</span>
                          </label>
                        )}
                      />
                      <Controller
                        name="healthInsuranceCoverage.children"
                        control={form.control}
                        render={({ field }) => (
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span>Children</span>
                          </label>
                        )}
                      />
                    </div>
                  </Field>
                </div>
              )}
            </div>

            {/* Dental Insurance */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Dental Insurance</h3>
              
              <Controller
                name="hasDentalInsurance"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Do you currently have Dental Insurance?</FieldLabel>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="h-4 w-4"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="h-4 w-4"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </Field>
                )}
              />

              {watchHasDentalInsurance && (
                <div className="border-l-2 border-gray-200 pl-4">
                  <Field>
                    <FieldLabel>If yes, who is covered in addition to you?</FieldLabel>
                    <div className="space-y-2">
                      <Controller
                        name="dentalInsuranceCoverage.spouse"
                        control={form.control}
                        render={({ field }) => (
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span>Spouse</span>
                          </label>
                        )}
                      />
                      <Controller
                        name="dentalInsuranceCoverage.children"
                        control={form.control}
                        render={({ field }) => (
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span>Children</span>
                          </label>
                        )}
                      />
                    </div>
                  </Field>
                </div>
              )}

              <Controller
                name="dentalExamLastYear"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Have you had a dental exam in the last year?</FieldLabel>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="h-4 w-4"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="h-4 w-4"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </Field>
                )}
              />
            </div>

            {/* Medical Appointments */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Medical Care</h3>
              
              <Controller
                name="hasRegularFamilyDoctor"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Do you have a regular family doctor?</FieldLabel>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="h-4 w-4"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="h-4 w-4"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Date of last appointment with a doctor:</FieldLabel>
                <div className="flex gap-2">
                  <Controller
                    name="lastDoctorAppointment.month"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name="lastDoctorAppointment.year"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Date of last OB/GYN exam:</FieldLabel>
                <div className="flex gap-2">
                  <Controller
                    name="lastObGynExam.month"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name="lastObGynExam.year"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </Field>

              <Controller
                name="mammogramStatus"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>If you are over 40 years old, have you ever had a mammogram?</FieldLabel>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === "yes"}
                          onChange={() => field.onChange("yes")}
                          className="h-4 w-4"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === "no"}
                          onChange={() => field.onChange("no")}
                          className="h-4 w-4"
                        />
                        <span>No</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === "not-applicable"}
                          onChange={() => field.onChange("not-applicable")}
                          className="h-4 w-4"
                        />
                        <span>Not Applicable</span>
                      </label>
                    </div>
                  </Field>
                )}
              />

              {watchMammogramStatus === "yes" && (
                <Field>
                  <FieldLabel>If yes, when was your last mammogram?</FieldLabel>
                  <div className="flex gap-2">
                    <Controller
                      name="lastMammogram.month"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="lastMammogram.year"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </Field>
              )}
            </div>

            {/* Mental Health */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Mental Health</h3>
              
              <Controller
                name="hasMentalIllness"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Have you ever been diagnosed with a mental illness?</FieldLabel>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="h-4 w-4"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="h-4 w-4"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </Field>
                )}
              />

              {watchHasMentalIllness && (
                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                  <Controller
                    name="receivingMentalHealthTreatment"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>
                          Are you currently receiving psychotherapy, medication, or any other treatment for this diagnosis?
                        </FieldLabel>
                        <div className="flex gap-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={field.value === true}
                              onChange={() => field.onChange(true)}
                              className="h-4 w-4"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={field.value === false}
                              onChange={() => field.onChange(false)}
                              className="h-4 w-4"
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </Field>
                    )}
                  />

                  <Controller
                    name="mentalHealthTreatmentExplanation"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Please explain:</FieldLabel>
                        <Textarea
                          {...field}
                          placeholder="Describe your current treatment or explain why you're not receiving treatment"
                        />
                      </Field>
                    )}
                  />
                </div>
              )}
            </div>

          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="px-4 sm:px-6">
        <Field orientation="horizontal" className="w-full">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            className="flex-1 sm:flex-none"
          >
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
