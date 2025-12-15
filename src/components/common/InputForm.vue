<!--
  Input Form Component
  Function: Country selection and parameter input
-->
<template>
  <div class="input-form-container">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <!-- Country 1 Selection -->
      <el-form-item label="Country 1" prop="country1">
        <el-select
          v-model="formData.country1"
          placeholder="Please select country"
          filterable
          clearable
        >
          <el-option
            v-for="country in countryList"
            :key="country.code"
            :label="country.name"
            :value="country.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- Country 2 Selection -->
      <el-form-item label="Country 2" prop="country2">
        <el-select
          v-model="formData.country2"
          placeholder="Please select country"
          filterable
          clearable
        >
          <el-option
            v-for="country in countryList"
            :key="country.code"
            :label="country.name"
            :value="country.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- Extra Parameters Slot -->
      <slot name="extra-fields"></slot>

      <!-- Action Buttons -->
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ buttonText }}
        </el-button>
        <el-button @click="handleReset">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'InputForm',
  props: {
    // Button Text
    buttonText: {
      type: String,
      default: 'Submit'
    },
    // Loading State
    loading: {
      type: Boolean,
      default: false
    },
    // Initial Data
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        country1: '',
        country2: ''
      },
      rules: {
        country1: [
          { required: true, message: 'Please select Country 1', trigger: 'change' }
        ],
        country2: [
          { required: true, message: 'Please select Country 2', trigger: 'change' }
        ]
      },
      // Common Country List
      countryList: [
        { code: 'CN', name: 'China' },
        { code: 'US', name: 'USA' },
        { code: 'EU', name: 'EU' },
        { code: 'JP', name: 'Japan' },
        { code: 'KR', name: 'South Korea' },
        { code: 'ASEAN', name: 'ASEAN' },
        { code: 'UK', name: 'UK' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'IN', name: 'India' },
        { code: 'BR', name: 'Brazil' },
        { code: 'RU', name: 'Russia' },
        { code: 'MX', name: 'Mexico' }
      ]
    }
  },
  mounted() {
    // Set initial values
    if (this.initialData) {
      this.formData = { ...this.formData, ...this.initialData }
    }
  },
  methods: {
    // Submit form
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formData)
        } else {
          this.$message.warning('Please fill in complete information')
          return false
        }
      })
    },
    
    // Reset form
    handleReset() {
      this.$refs.form.resetFields()
      this.$emit('reset')
    },
    
    // Get form data
    getFormData() {
      return this.formData
    },
    
    // Set form data
    setFormData(data) {
      this.formData = { ...this.formData, ...data }
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.input-form-container {
  /deep/ .el-form {
    .el-form-item {
      margin-bottom: 22px;
    }
    
    .el-select {
      width: 100%;
    }
  }
}
</style>
