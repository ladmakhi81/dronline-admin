import { Card } from "antd";
import styled from "styled-components";

export const Container = styled(Card)`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .ant-empty-image {
    height: 200px;
  }

  .ant-empty {
    width: 300px;
  }
`;
