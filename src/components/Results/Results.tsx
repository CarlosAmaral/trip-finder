import * as React from "react";
import { List, Divider, Row, Col, Tag } from "antd";
import { connect } from "react-redux";
import { CAR, BUS, TRAIN } from "../../utils/constants";
import {
  FaTrain,
  FaBus,
  FaCar,
  FaArrowRight,
  FaEuroSign,
  FaPercentage
} from "react-icons/fa";

export interface IProps {
  path: any;
}

class Results extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.renderList = this.renderList.bind(this);
  }

  public renderList = (item: any) => {
    return (
      <List.Item>
        <List.Item.Meta
          title={
            <div className="header-result">
              <span>{item.departure}</span>{" "}
              <span style={{ padding: "0 20px" }}>
                <FaArrowRight />
              </span>
              <span>{item.arrival}</span>
            </div>
          }
          description={
            <div className="description-result">
              <Row gutter={32}>
                <Col span={4}>
                {this.renderTransportationIcon(item.result.transport)}
                </Col>
                <Col span={6}>
                  <span className="description-title">Reference</span>
                  <span>
                    <Tag color="var(--color-red)">{item.result.reference}</Tag>
                  </span>
                </Col>
                <Col span={6}>
                  <div>
                    <span className="description-title">Cost</span>
                    <span className="description-subtitle">
                      {item.result.cost}
                      <FaEuroSign style={{ color: "var(--color-red)" }} />
                    </span>
                  </div>
                  <div>
                    <span className="description-title">Discount</span>
                    <span className="description-subtitle">
                      {item.result.discount}
                      <FaPercentage style={{ color: "var(--color-red)" }} />
                    </span>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <span className="description-title">Duration</span>
                    <span className="description-subtitle">
                      {this.convertMinToHoursWithMin(item.result.duration)}
                    </span>
                  </div>
                  <div>
                    <span className="description-title">Transport</span>
                    <span className="description-subtitle">
                      {item.result.transport}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          }
        />
      </List.Item>
    );
  };

  public render() {
    const{ path } = this.props;
    return (
      <div className="results-container">
        {path.length > 0 &&
          <React.Fragment>
            <Divider className="results-divider">Your Route</Divider>
            <List
              className="list-container"
              itemLayout="horizontal"
              dataSource={this.props.path}
              renderItem={this.renderList}
              locale={{ emptyText: "" }}
            />
          <div className="list-footer">
            <div>
              <span className="list-footer-title">Total: </span>
              <span className="list-footer-desc">{this.calculateTotalCost()}
                <FaEuroSign style={{ color: "var(--color-red)" }} />
              </span>
            </div>
            <div>
              <span className="list-footer-title">Duration: </span>
              <span className="list-footer-desc">{this.calculateTotalDuration()}</span>
            </div>
          </div> 
          </React.Fragment>}
      </div>
    );
  }

  private renderTransportationIcon = (transport: string) => {
    switch (transport) {
      case CAR:
        return <FaCar size={40} style={{ color: "var(--color-red)" }} />;
      case BUS:
        return <FaBus size={40} style={{ color: "var(--color-red)" }} />;
      case TRAIN:
        return <FaTrain size={40} style={{ color: "var(--color-red)" }} />;
      default:
        return;
    }
  };

  private convertMinToHoursWithMin(duration: number) {
    const hours = duration / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours + "h" + rminutes + "m";
  }

  private calculateTotalCost = () => {
    const { path } = this.props;
    const extractCost = path.map((k:any) => k.result.cost - (k.result.cost / 100) * k.result.discount);
    const costReducer = (acc: any, val:any) => acc + val;
    const totalCost = extractCost.reduce(costReducer);
    return totalCost;
  }

  private calculateTotalDuration = () => {
    const { path } = this.props;
    const extractDuration = path.map((k:any) => k.result.duration);
    const costReducer = (acc: any, val:any) => acc + val;
    const totalCost = extractDuration.reduce(costReducer);
    return this.convertMinToHoursWithMin(totalCost);
  }
}

const mapStateToProps = (state: any) => ({
  path: state.deals.path
});

export default connect(
  mapStateToProps,
  null
)(Results);
