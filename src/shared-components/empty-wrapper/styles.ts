import { Flex } from "antd";
import styled from "styled-components";

export const Container = styled(Flex)`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .ant-empty-image {
    height: 200px;
  }

  .ant-empty {
    width: 300px;
  }
`;
