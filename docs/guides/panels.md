# Panels

`@panel` is a source comment convention for values that can be edited from a panel UI.

## Rules

- Put `@panel` immediately above the declaration it controls.
- Use top-level `const` declarations.
- Initializers must be directly rewritable literals: string, number, boolean, or a color literal for `type:'color'`.
- Do not use `@panel` on `let`, `var`, local variables, computed initializers, or private details that should not be edited.

## Supported Forms

```tsx
// @panel
const title = 'Today';

// @panel {type:'slider',min:8,max:64,step:1}
const titleSize = 24;

// @panel {type:'menu',items:['monospaced','rounded','serif','default']}
const design = 'rounded';

// @panel {type:'color'}
const accent = 'blue';

// @panel {type:'password'}
const token = '';
```

## Example

```tsx
import {Text, VStack} from 'await';

// @panel
const title = 'Focus';

// @panel {type:'slider',min:12,max:40,step:1}
const size = 24;

// @panel {type:'color'}
const color = 'indigo';

function widget() {
	return (
		<VStack maxSides padding={16} background='background'>
			<Text value={title} fontSize={size} foreground={color}/>
		</VStack>
	);
}

Await.define({widget});
```

