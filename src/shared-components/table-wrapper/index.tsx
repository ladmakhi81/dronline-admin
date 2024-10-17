"use client";

import { Table, TableProps } from "antd";
import { FC } from "react";
import styled from "styled-components";

const TableWrapper: FC<TableProps> = (tableProps) => {
  return (
    <Container>
      <Table {...tableProps} scroll={{ x: "max-content" }} />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  .ant-table-wrapper,
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100% !important;
  }

  .ant-spin-container {
    display: flex;
    flex-direction: column;
  }

  .ant-table {
    flex: 1;
  }

  .ant-pagination {
    position: relative;
    margin-bottom: 0 !important;
  }

  .ant-pagination-options {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export default TableWrapper;
