"use client";

import { Button, Empty, Flex, Typography } from "antd";
import { FC, PropsWithChildren } from "react";
import { Container } from "./styles";

interface Props extends PropsWithChildren {
  isEmpty: boolean;
  title: string;
  description: string;
  btn?: { text: string; click: () => void };
}

const EmptyWrapper: FC<Props> = ({
  description,
  isEmpty,
  title,
  children,
  btn,
}) => {
  if (!isEmpty) return children;
  return (
    <Container>
      <Empty
        description={
          <Flex vertical>
            <Typography.Title level={5}>{title}</Typography.Title>
            <Typography.Text>{description}</Typography.Text>
            {btn && (
              <Button
                type="primary"
                style={{ marginTop: "30px" }}
                onClick={btn.click}
              >
                {btn.text}
              </Button>
            )}
          </Flex>
        }
      />
    </Container>
  );
};

export default EmptyWrapper;
