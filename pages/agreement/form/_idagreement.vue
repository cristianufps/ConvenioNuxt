<template>
  <a-card title="Registrar Convenio">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Nombre</span>
        <a-input
          v-decorator="[
          'nombre',
          {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Tipo Convenio">
        <a-select
          @change="typeAgreement"
          v-decorator="[
          'select',
          { rules: [{ required: true, message: 'Please select your country!' }] },
        ]"
          placeholder="Seleccione tipo de convenio"
        >
          <a-select-option value="1">Macro</a-select-option>
          <a-select-option value="2">Especifico</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-show="parent" v-bind="formItemLayout" label="Convenio padre">
        <a-select
          v-decorator="[
          'padre',
          { rules: [{ required: false, message: 'Please select your country!' }] },
        ]"
          placeholder="Por favor seleccione un convenio Macro (opcional)"
        >
          <a-select-option value="china">China</a-select-option>
          <a-select-option value="usa">U.S.A</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Categoria">
        <a-select
          v-decorator="[
          'categoria',
          { rules: [{ required: true, message: 'Please select your country!' }] },
        ]"
          placeholder="Seleccione categoria"
        >
          <a-select-option value="china">Macro</a-select-option>
          <a-select-option value="usa">Especifico</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Fecha inicial">
        <a-date-picker v-decorator="['date-picker', config]" />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Duración">
        <a-input
          v-decorator="[
          'duracion',
          {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          },
        ]"
          style="width: 100%"
        >
          <a-select
            slot="addonBefore"
            v-decorator="['prefix', { initialValue: '57' }]"
            style="width: 100px"
          >
            <a-select-option value="57">Años</a-select-option>
            <a-select-option value="86">Meses</a-select-option>
          </a-select>
        </a-input>
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Costo</span>
        <a-input
          v-decorator="[
          'costo',
          {
            rules: [{ required: false, message: 'Please input your nickname!', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Razón o descripción</span>
        <a-textarea
          placeholder="Descripcion"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          v-decorator="[
          'descripcion',
          {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button type="primary" html-type="submit">Registrar</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
const residences = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake"
          }
        ]
      }
    ]
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men"
          }
        ]
      }
    ]
  }
];

export default {
  layout: "administrador",
  data() {
    return {
      parent: false,
      confirmDirty: false,
      residences,
      autoCompleteResult: [],
      config: {
        rules: [
          { type: "object", required: true, message: "Please select time!" }
        ]
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    handleWebsiteChange(value) {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = [".com", ".org", ".net"].map(
          domain => `${value}${domain}`
        );
      }
      this.autoCompleteResult = autoCompleteResult;
    },
    typeAgreement(e) {
      console.log("--> ", e);
      if (e == 1) {
        this.parent = false;
      } else {
        this.parent = true;
      }
    }
  }
};
</script>