import { Input } from "@earendil-works/pi-tui";
import { Field } from "../../../src/forms/field";
import { Stack } from "../../../src/layout/stack";
import type { ShowcaseDemo } from "../../app/types";

const bold = (t: string) => `\x1b[1m${t}\x1b[0m`;
const dim = (t: string) => `\x1b[2m${t}\x1b[0m`;

export const fieldDemo: ShowcaseDemo = {
  id: "field",
  title: "Field",
  category: "forms",
  summary:
    "Wraps any input component with label, description, and error display",
  variants: [
    {
      id: "basic",
      title: "Basic field",
      description: "Label + input",
      render: () => {
        const stack = new Stack({ gap: 1 });
        const input1 = new Input();
        input1.setValue("hello@example.com");
        stack.addChild(new Field({ label: "Email", input: input1 }));
        const input2 = new Input();
        input2.setValue("password123");
        stack.addChild(
          new Field({ label: "Password", input: input2, required: true }),
        );
        return stack;
      },
    },
    {
      id: "with-description",
      title: "With description",
      description: "Label + description + input",
      render: () => {
        const input = new Input();
        input.setValue("my-project");
        return new Field({
          label: "Project name",
          input,
          description: "Use lowercase letters, numbers, and hyphens",
          descriptionStyle: dim,
        });
      },
    },
    {
      id: "with-error",
      title: "With error",
      description: "Label + input + error message",
      render: () => {
        const input = new Input();
        input.setValue("abc");
        return new Field({
          label: "Username",
          input,
          error: "Must be at least 3 characters",
          required: true,
        });
      },
    },
    {
      id: "styled",
      title: "Styled",
      description: "Custom label and required styles",
      render: () => {
        const input = new Input();
        input.setValue("42");
        return new Field({
          label: "Answer",
          input,
          description: "The answer to life, the universe, and everything",
          descriptionStyle: dim,
          labelStyle: bold,
          required: true,
        });
      },
    },
  ],
};
