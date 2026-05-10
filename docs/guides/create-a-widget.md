# Create A Widget

Start from a small view tree, then add data, panels, timelines, and intents only when needed.

## Steps

1. Create or open an Await widget project.
2. Ensure `package.json` includes `@await-widget/runtime` and `typescript`.
3. Ensure `tsconfig.json` uses:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "await",
    "types": ["@await-widget/runtime"]
  }
}
```

4. Import components from `await`.
5. Implement `widget`.
6. Register it with `Await.define`.
7. Run `npm test`.

## Starter Template

```tsx
import {Text, VStack} from 'await';

// @panel {type:'color'}
const accent = 'blue';

function widget() {
	return (
		<VStack spacing={8} maxSides padding={16} background='background'>
			<Text value='Await' fontSize={18} fontWeight='semibold'/>
			<Text value='Small things, close at hand' foreground={accent} minimumScaleFactor={0.7}/>
		</VStack>
	);
}

Await.define({
	widget,
});
```

## AI Checklist

- Use only components listed in [Await](../reference/await.md).
- Use only props and modifiers listed in [Prop](../reference/prop.md).
- Put `padding` before `background` when the background should include the padded area.
- Use `maxSides` on the root when the widget should fill the available size.
- Add stable `id` values for animated or changing visual entities.
