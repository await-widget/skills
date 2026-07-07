# Panels

`@panel` marks declarations that Await exposes as editable controls in the panel UI. It applies to top-level `const` declarations and parameterless methods registered in `widgetIntents` (see [widget-button.md](widget-button.md)).

## Usage

- Place `@panel` immediately above a top-level declaration.
- On `const`: initializers must be directly rewritable literals — `string`, `number`, or `boolean`.
- On functions: the method must have zero parameters.

## Syntax

The annotation sits as a leading comment above the declaration:
```tsx
// @panel {type:'slider',min:0,max:10,step:1,title:'Padding'}
const value = 0;
```
Every annotation can include an optional `title` to override the variable or function name in the panel UI.

The `type` field (or its absence) selects how the declaration is rendered:
- **Slider** — `type:'slider'` with a number literal. Requires `min` and `max`; auto-swapped if `max < min`. Optional `step` (positive finite).
- **Menu** — `type:'menu'` with a string/number literal. Requires `items` (array). Items that don't type-match are dropped; rejected if the result is empty.
- **Color** — `type:'color'` with a string literal (e.g. `'8055ff'`).
- **Password** — `type:'password'` with a string literal.
- **Toggle** — omit `type` with a boolean literal.
- **Text Input** — omit `type` with a string literal.
- **Number Input** — omit `type` with a number literal.
- **Button** — omit `type` on a parameterless function.

## Example

```tsx
// @panel
const title = 'Token Validation';
// @panel
const showTitle = true;
// @panel {type:'slider',min:8,max:64,step:1}
const fontSize = 24;
// @panel {type:'menu',items:['monospaced','rounded','serif','default']}
const fontDesign = 'rounded';
// @panel {type:'menu',items:[400,600,800]}
const fontWeight = 400;
// @panel {type:'color'}
const foreground = '00f';
// @panel {type:'password'}
const token = '';
// @panel {type:'slider',min:0,max:1}
const background = 0.5;
// @panel {title:'Reset'}
function reset() {
	AwaitStore.set('count', 0);
}

function widget() {
	return (
		<ZStack foreground={foreground} fontDesign={fontDesign} fontWeight={fontWeight} fontSize={fontSize}>
			<Color value={background}/>
			<VStack>
				{showTitle ? <Text value={title}/> : undefined}
				<Text value={token.length > 8 ? 'Token valid' : 'Token invalid'}/>
			</VStack>
		</ZStack>
	);
}

Await.define({
	widget,
	widgetIntents: {reset},
});
```
