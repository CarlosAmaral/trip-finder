import * as React from "react";
import { connect } from "react-redux";
import { Select, Radio, Button, Form } from "antd";
import { FormComponentProps } from "antd/lib/form/Form";
import { IArrival, IDeparture, IFormValues } from "../../models/interfaces";
import { getRoute, resetPath } from "../../actions/dealsActions";
import { FASTEST, CHEAPEST, COST } from "../../utils/constants";
import {
  continueFormStep,
  backFormStep,
  updateForm,
  resetForm
} from "../../actions/formActions";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface IProps {
  getRoute: any;
  continueFormStep: any;
  updateForm: any;
  resetForm: any;
  resetPath: any;
  formValues: IFormValues;
  backFormStep: any;
  arrivals: IArrival[];
  formStep: number;
  departures: IDeparture[];
  path: any;
}

class Search extends React.Component<IProps & FormComponentProps> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
    this.handleContinueForm = this.handleContinueForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  public handleContinueForm = () => {
    const {
      form: { validateFields },
      formValues
    } = this.props;
    validateFields((errors, values: IFormValues) => {
      if (!errors) {
        const formFields = {
          arrival: values.arrival ? values.arrival : formValues.arrival,
          departure: values.departure ? values.departure : formValues.departure,
          weight: values.weight ? values.weight : formValues.weight
        };
        this.props.updateForm(formFields);
        this.props.continueFormStep();
      }
    });
  };

  public submitForm = () => {
    this.props.getRoute(this.props.formValues)
    this.props.continueFormStep();
  };

  public restartForm = () => {
    this.props.resetForm();
    this.props.resetPath();
  }

  public renderActionBtns = () => {
    const { formStep } = this.props;
    return (
      <div className="btns-container">
        {(formStep > 0 && formStep <= 3) &&(
          <Button
            className="btn-back"
            onClick={this.props.backFormStep}
            size="large"
            htmlType="button"
          >
            Back
          </Button>
        )}
        {(formStep >= 0 && formStep < 3) && (
          <Button
            size="large"
            onClick={this.handleContinueForm}
            className="btn-continue"
            htmlType="button"
          >
            Continue
          </Button>
        )}
        {formStep === 3 && (
          <Button
            size="large"
            onClick={this.submitForm}
            className="btn-submit"
            htmlType="button"
          >
            Calculate Trip
          </Button>
        )}
        {formStep === 4 && (
          <Button
            size="large"
            onClick={this.restartForm}
            className="btn-continue"
            htmlType="button"
          >
            New Trip
          </Button>
        )}
      </div>
    );
  };

  public renderDepartureFormItem = () => {
    const {
      form: { getFieldDecorator },
      formValues
    } = this.props;
    return (
      
      <div className="select-wrapper">
        <div className="form-item-title">
          From where do you want to departure?
        </div>
        <FormItem>
          {getFieldDecorator("departure", {
            initialValue: formValues.departure,
            rules: [
              {
                message: "Please choose a departure",
                required: true
              },
              {
                validator: this.isArrivalEqualToDeparture
              }
            ]
          })(
            <Select
              showSearch={true}
              size="large"
              style={{ width: 250 }}
              placeholder="Select a Departure"
              optionFilterProp="children"
              filterOption={this.filterOptions}
            >
              {this.props.departures.map(d => (
                <Option key={d.key} value={d.departure}>
                  {d.departure}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </div>
    );
  };

  public renderRadioFormItem = () => {
    const {
      form: { getFieldDecorator },
      formValues
    } = this.props;
    return (
      <div className="select-wrapper">
        <div className="form-item-title">
          Do you want to go take the cheapest or fastest route?
        </div>
        <FormItem>
          {getFieldDecorator("weight", {
            initialValue: formValues.weight,
            rules: [
              {
                message: "Please choose the cheapest or fastest route",
                required: true
              }
            ]
          })(
            <RadioGroup size="large">
              <RadioButton value="cost">Cheapest</RadioButton>
              <RadioButton value="duration">Fastest</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
      </div>
    );
  };
  public renderRouteSelection = () => {
    const { formValues, formStep } = this.props;
    return (
      <div className="route-container">
        {formStep > 0 && (
          <div>
            <span className="text-title">From</span>
            <span className="text-desc">{formValues.departure}</span>
          </div>
        )}
        {formStep > 1 && (
          <div>
            <div className="vertical-border" />
            <span className="text-title">Route</span>
            <span className="text-desc">
              {this.translateWeight(formValues.weight)}
            </span>
          </div>
        )}
        {formStep > 2 && (
          <div>
            <div className="vertical-border" />
            <span className="text-title">To</span>
            <span className="text-desc">{formValues.arrival}</span>
          </div>
        )}
      </div>
    );
  };

  public renderArrivalFormItem = () => {
    const {
      form: { getFieldDecorator },
      formValues
    } = this.props;
    return (
      <div className="select-wrapper">
        <div className="form-item-title">To where do you want to go?</div>
        <FormItem>
          {getFieldDecorator("arrival", {
            initialValue: formValues.arrival,
            rules: [
              {
                message: "Please choose an arrival",
                required: true
              },
              {
                validator: this.isDepartureEqualToArrival
              }
            ]
          })(
            <Select
              showSearch={true}
              size="large"
              style={{ width: 250 }}
              placeholder="Select an Arrival"
              optionFilterProp="children"
              filterOption={this.filterOptions}
            >
              {this.props.arrivals.map(a => (
                <Option key={a.key} value={a.arrival}>
                  {a.arrival}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </div>
    );
  };
  public render() {
    const { formStep } = this.props;

    return (
      <div className="search-container">
        <Form hideRequiredMark={true}>
          {this.renderRouteSelection()}
          {formStep === 0 && this.renderDepartureFormItem()}
          {formStep === 1 && this.renderRadioFormItem()}
          {formStep === 2 && this.renderArrivalFormItem()}
          {this.renderActionBtns()}
        </Form>
      </div>
    );
  }

  private filterOptions(input: any, option: any) {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }
  private translateWeight(weight: string) {
    if (weight === COST) {
      return CHEAPEST;
    } else {
      return FASTEST;
    }
  }

  private isDepartureEqualToArrival = (rule: any, value: string, cb: any) => {
    const { formValues } = this.props;
    if (formValues.departure === value) {
      cb("Your Departure cannot be the same as your Arrival");
    } else {
      cb();
    }
  };

  private isArrivalEqualToDeparture = (rule: any, value: string, cb: any) => {
    const { formValues } = this.props;
    if (formValues.arrival === value && formValues.arrival !== undefined) {
      cb("Your Arrival cannot be the same as your Departure");
    } else {
      cb();
    }
  };
}

const mapStateToProps = (state: any) => ({
  arrivals: state.deals.arrivalsArray,
  departures: state.deals.departuresArray,
  formStep: state.form.formStep,
  formValues: state.form.formValues,
  path: state.deals.path
});

const mapDispatchToProps = {
  backFormStep,
  continueFormStep,
  getRoute,
  resetForm,
  resetPath,
  updateForm
};

const SearchForm = Form.create<IProps & FormComponentProps>()(Search);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm);
