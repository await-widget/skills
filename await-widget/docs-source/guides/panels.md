# Panels

`@panel` marks declarations that Await exposes as editable controls in the panel UI. It applies to top-level `const` declarations and parameterless functions registered in `widgetIntents` (see [widget-button.md](widget-button.md)).

## Usage

- Place `@panel` immediately above a top-level declaration.
- A `const` marked `@panel` must have a directly rewritable `string`, `number`, `boolean`, or string-array literal initializer.
- A function marked `@panel` must have no parameters.

## Syntax

The annotation sits as a leading comment above the declaration:
```tsx
// @panel {type:'slider',min:0,max:10,step:1,title:'Padding',title_zh:'间距'}
const value = 0;
```
Every annotation can include an optional `title` to override the variable or function name in the panel UI. Use `title_en` and `title_zh` to override it for Await's English and Chinese app languages.

The `type` field (or its absence) selects how the declaration is rendered:
- **Slider** — `type:'slider'` with a number literal. Requires `min` and `max`. `step` is optional and must be a positive finite number.
- **String Array** — `type:'strings'` with a string-array literal. `min` and `max` are optional safe integers that limit deletion and addition. Use `min` of at least 0 and `max` of at least 1.
- **Menu** — `type:'menu'` with a string/number literal. Requires `items` (array). Await drops items whose type does not match the literal. If no items remain, it does not create a menu control.
- **Color** — `type:'color'` with a string literal (e.g. `'8055ff'`).
- **Password** — `type:'password'` with a string literal.
- **Toggle** — omit `type` with a boolean literal.
- **Text Input** — omit `type` with a string literal.
- **Number Input** — omit `type` with a number literal.
- **Button** — omit `type` on a parameterless function.

Invalid annotation syntax, invalid slider `min`/`max`/`step`, or invalid string-array `min`/`max` prevent the control from appearing.

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
// @panel {type:'strings',min:0,max:4}
const labels: string[] = ['One', 'Two'];
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
				<Text value={labels.join(', ')}/>
			</VStack>
		</ZStack>
	);
}

Await.define({
	widget,
	widgetIntents: {reset},
});
```
