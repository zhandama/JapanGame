<template>
  <input
    v-if="show"
     :maxlength='maxlength'
     :class="inputClass"
     :type="inputType"
     :placeholder="inputPlaceholder"
     ref="input"
     v-bind:value="value"
     v-on:blur="inputBlur"
     v-on:input="updateValue($event.target.value)"
  >
</template>

<script>
  /**
   * 输入框组件
   */
  export default {
    props: {
      value: {},
      show: {type: Boolean, default: true}, // 是否显示
      saveSmallNum: {type: Number, default: -1}, // -1 为不保留小数，1为保留小数点后一位
      inputPlaceholder: {type: String, default: ''},
      inputType: {type: String, default: ''},
      inputClass: {type: String, default: ''},
      minValue: {type: Number, default: 0}, // 最小值
      maxValue: {type: Number, default: 1000000000000000}, // 最大值
      maxlength: {type: Number, default: 15},
    },
    methods: {
      /* 更新值 */
      updateValue(value) {
        this.$emit('writing')
        let formattedValue = value
        // 删除两侧的空格符
        .trim()
        // 保留 0 小数位
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + this.saveSmallNum + 1
        )
//        console.log(formattedValue)
        /* 如果为空值提前结束 ,或是末尾是 `.0`*/
//        console.log(formattedValue.lastIndexOf('.') === formattedValue.length - 2 && formattedValue.lastIndexOf('0') === formattedValue.length - 1)
        if (formattedValue.length === 0 || (
            formattedValue.lastIndexOf('.') > -1 && formattedValue.lastIndexOf('.') === formattedValue.length - 2
            && formattedValue.lastIndexOf('0') === formattedValue.length - 1)) {
          this.$refs.input.value = formattedValue.toString()
          this.$emit('input', formattedValue.toString())
          this.$emit('change')
          return
        }
        formattedValue = isNaN(parseFloat(formattedValue)) ? '' : Math.abs(parseFloat(formattedValue))
        if (formattedValue < this.minValue) formattedValue = this.minValue // 判断最小值
        if (formattedValue > this.maxValue) formattedValue = this.maxValue // 判断最大值
//        console.log(formattedValue)
        /* 取整 */
        if (value.indexOf('.') === value.length - 1 && this.saveSmallNum > -1) {
          // 如果只存在一个.  而且这个. 只在末尾， 则保留该点
        }
        else if (value.split('.').length === 3) {
          // 如果存在两个 . ，抹去最后一个
          this.$refs.input.value = value.substring(0, value.length - 1)
        }
        else if (formattedValue !== value) {// 如果值不统一，手动覆盖以保持一致
          this.$refs.input.value = formattedValue.toString()
        }
        // 通过 input 事件发出数值
        this.$emit('input', formattedValue.toString())
        this.$emit('change')
      },
      inputBlur() {
        this.$emit('blur')
      }
    }
  }
</script>
