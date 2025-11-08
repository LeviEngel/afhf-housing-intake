"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useFieldArray } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldContent,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

import { Input } from "@/components/ui/input"

const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
] as const

const formSchema = z.object({
  children: z
    .array(
      z.object({
        name: z.string("child name is required"),
        birthday: z.coerce.date(),
        ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
        gender: z.string().min(1),
        race: z.string(),
        living: z.boolean(),
      })
    )
})

export default function Children() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      children: [],
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  })

  function onSubmit(data: any) {
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
        <CardTitle>Children</CardTitle>
        <CardDescription>
          If you have children, please provide their information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet className="gap-2">
            <FieldGroup>
              {fields.map((field, index) => (
                <Controller
                  key={field.id}
                  name={`children.${index}.name`}
                  control={form.control}
                  render={({ field: controllerField, fieldState }) => (
                    <Card className="p-4">
                      <CardTitle>
                        Child {index + 1}
                      </CardTitle>
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...controllerField}
                          id={`form-rhf-input-child-name-${index}`}
                          aria-invalid={fieldState.invalid}
                          placeholder="Child's Name"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                      
                      <Controller
                        name={`children.${index}.birthday`}
                        control={form.control}
                        render={({ field, fieldState }) => {
                          // field.value is a Date | undefined
                          const value = field.value instanceof Date && !isNaN(field.value.getTime())
                            ? field.value.toISOString().slice(0, 10)
                            : ""

                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={`form-rhf-input-birthdate-${index}`}>
                                Birthdate
                              </FieldLabel>
                              <Input
                                id={`form-rhf-input-birthdate-${index}`}
                                type="date"
                                value={value}
                                onChange={(e) => {
                                  const v = e.target.value
                                  if (v === "") {
                                    // clear the value
                                    field.onChange(undefined)
                                  } else {
                                    field.onChange(new Date(v))
                                  }
                                }}
                                aria-invalid={fieldState.invalid}
                              />
                              <FieldDescription>
                                Your birthdate. This field is required.
                              </FieldDescription>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )
                        }}
                      />
                      <Controller
                        name={`children.${index}.ssn`}
                        control={form.control}
                        render={({ field, fieldState }) => {
                          //field is valid ssn format XXX-XX-XXXX
                          const value = field.value
                          return (
                            <Field>
                              <FieldLabel htmlFor={`form-rhf-input-ssn-${index}`}>
                                Social Security Number
                              </FieldLabel>
                              <Input {...field}
                                placeholder="XXX-XX-XXXX"
                                aria-invalid={fieldState.invalid}
                              />
                              <FieldDescription>
                                The child's SSN. Format: XXX-XX-XXXX
                              </FieldDescription>
                            </Field>
                          )
                        }}
                      />
                      <Controller
                        name={`children.${index}.gender`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field
                            orientation="responsive"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldContent>
                              <FieldLabel htmlFor="form-rhf-select-gender">
                                Gender
                              </FieldLabel>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </FieldContent>
                            <Select
                              name={field.name}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                id="form-rhf-select-gender"
                                aria-invalid={fieldState.invalid}
                                className="min-w-[120px]"
                              >
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectSeparator />
                                {gender.map((language) => (
                                  <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                          
                        )}
                      />
                      <Controller
                        name={`children.${index}.race`}
                        control={form.control}
                        render={({ field, fieldState }) => {
                          return (
                            <Field>
                              <FieldLabel htmlFor={`form-rhf-input-race-${index}`}>
                                Race
                              </FieldLabel>
                              <Input {...field}
                                placeholder="Race"
                                aria-invalid={fieldState.invalid}
                              />
                            </Field>
                          )
                        }}
                      />
                      <Controller
                        name={`children.${index}.living`}
                        control={form.control}
                        render={() => {
                          //field is valid ssn format XXX-XX-XXXX
                          return (
                            <RadioGroup defaultValue="comfortable">
                              <Label>Is the child living with you?</Label>
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="default" id="r1" />
                                <Label htmlFor="r1">Yes</Label>
                              </div>
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="comfortable" id="r2" />
                                <Label htmlFor="r2">No</Label>
                              </div>

                            </RadioGroup>
                          )
                        }}
                      />
                      
                    </Card>
                  )}
                />
              ))}
            </FieldGroup>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", birthday: undefined, ssn: "", gender: "",  race: "",  living: false })}
              disabled={fields.length >= 5}
            >
              Add Child
            </Button>
          </FieldSet>

        </form>

      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-input">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
