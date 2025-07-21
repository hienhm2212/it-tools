<script setup lang="ts">
import bwipjs, { type RenderOptions } from 'bwip-js/browser';
import { Base64 } from 'js-base64';
import formats from './barcode.formats.json';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { evaluateEscapes } from './evaluateEscapes'

const foreground = useQueryParamOrStorage({ name: 'fg', storageName: 'barcode-gen:fg', defaultValue: '#000000' });
const background = useQueryParamOrStorage({ name: 'bg', storageName: 'barcode-gen:bg', defaultValue: '#FFFFFF' });
const scale = useQueryParamOrStorage({ name: 'scale', storageName: 'barcode-gen:scale', defaultValue: 2 });
const height = useQueryParamOrStorage({ name: 'height', storageName: 'barcode-gen:height', defaultValue: 25 });
const margin = useQueryParamOrStorage({ name: 'margin', storageName: 'barcode-gen:margin', defaultValue: 10 });
const format = useQueryParamOrStorage({ name: 'format', storageName: 'barcode-gen:format', defaultValue: 'code128' });
const displayValue = useQueryParamOrStorage({ name: 'display', storageName: 'barcode-gen:display', defaultValue: true });
const value = ref('123456789');
const barcodeCanvas = ref<HTMLCanvasElement>();
const evaluateEscape = ref(false);

const options = computed<RenderOptions>(() => {
  const raw = value.value;
  const processed = evaluateEscape.value ? evaluateEscapes(raw) : raw;

  // Strip escape sequences for clean human-readable text
  const cleanedText = evaluateEscape.value ? raw.replace(/\\[A-Za-z]/g, '') : raw;

  // Check if this is a 2D barcode format
  const is2D = ['datamatrix', 'qrcode', 'azteccode', 'pdf417', 'maxicode', 'microqrcode'].includes(format.value.toLowerCase());

  const baseOptions = {
	bcid: format.value === 'auto' ? 'code128' : format.value,
	text: processed,
	alttext: cleanedText, // Display text below barcode
	barcolor: foreground.value,
	textcolor: foreground.value,
	backgroundcolor: background.value,
	padding: margin.value,
	includetext: displayValue.value,
	textxalign: 'center' as const,
	textsize: 10, // Smaller text size for better fit
	textgaps: 1, // Smaller gap
	textyalign: 'below' as const, // Ensure text appears below barcode
	parse: true, // Enable control character parsing (like FNC1 from \u001D)
  };

  // For 2D formats, use higher scale and don't set height
  if (is2D) {
	return {
	  ...baseOptions,
	  scale: Math.max(scale.value, 4), // Minimum scale of 4 for 2D formats
	};
  }

  // For linear formats, use normal scale and height
  return {
	...baseOptions,
	scale: scale.value,
	height: height.value,
  };
});

const error = ref('');
watchEffect(() => {
  if (!barcodeCanvas.value) {
	return;
  }

  try {
	bwipjs.toCanvas(barcodeCanvas.value, options.value);
  }
  catch (e: any) {
	error.value = e.toString();
  }
});

const barcodePNG = computed(() => {
  return barcodeCanvas.value?.toDataURL('image/png') || '';
});

const barcodeSVG = computed(() => {
  try {
	const raw = value.value
	const processed = evaluateEscape.value ? evaluateEscapes(raw) : raw
	return Base64.encode(bwipjs.toSVG({ ...options.value, text: processed, includetext: displayValue.value }))
  } catch {
	return ''
  }
})


const { download: downloadPNG } = useDownloadFileFromBase64({ source: barcodePNG, filename: 'barcode.png' });
const { download: downloadSVG } = useDownloadFileFromBase64({ source: barcodeSVG, filename: 'barcode.svg' });
</script>

<template>
  <c-card>
	<n-grid x-gap="12" y-gap="12" cols="1 600:2">
	  <n-gi>
		<c-input-text
		  v-model:value="value"
		  label-position="left"
		  label-width="130px"
		  label-align="right"
		  label="Text:"
		  multiline
		  rows="1"
		  autosize
		  placeholder="Your barcode..."
		  mb-6
		/>
		<n-form label-width="130" label-placement="left">
		  <c-select
			v-model:value="format"
			label="Format:"
			label-position="left"
			label-width="130px"
			label-align="right"
			:options="formats"
			searchable
			mb-4
		  />
		  <n-form-item label="Evaluate escapes:">
			<n-checkbox v-model:checked="evaluateEscape" />
		  </n-form-item>
		  <n-form-item label="Foreground color:">
			<n-color-picker v-model:value="foreground" :modes="['hex']" :show-alpha="false" />
		  </n-form-item>
		  <n-form-item label="Background color:">
			<n-color-picker v-model:value="background" :modes="['hex']" :show-alpha="false" />
		  </n-form-item>
		  <n-form-item label="Scale:">
			<n-input-number v-model:value="scale" :min="0" />
		  </n-form-item>
		  <n-form-item label="Height (mm):">
			<n-input-number v-model:value="height" :min="0" />
		  </n-form-item>
		  <n-form-item label="Margin:">
			<n-input-number v-model:value="margin" :min="0" />
		  </n-form-item>
		  <n-form-item label="Display text:">
			<n-checkbox v-model:checked="displayValue" />
		  </n-form-item>
		</n-form>
	  </n-gi>
	  <n-gi>
		<div class="barcode-container">
		  <c-alert v-if="error">
			{{ error }}
		  </c-alert>
		  <canvas ref="barcodeCanvas" />
		  <div flex justify-center>
			<c-button mr-2 @click="downloadPNG">
			  Download PNG barcode
			</c-button>
			<c-button @click="downloadSVG">
			  Download SVG barcode
			</c-button>
		  </div>
		</div>
	  </n-gi>
	</n-grid>
  </c-card>
</template>

<style lang="less" scoped>
.barcode-container {
  max-width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

canvas {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
