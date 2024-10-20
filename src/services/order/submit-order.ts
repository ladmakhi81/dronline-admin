import { httpClient } from "@/core/http-client.core";
import { Order, SubmitOrderReqBody } from "./types";
import { useMutation } from "@tanstack/react-query";

const submitOrder = (data: SubmitOrderReqBody) => {
  return httpClient.post("/orders/admin/submit", data) as Promise<Order>;
};

export const useSubmitOrder = () => {
  return useMutation({
    mutationFn: (data: SubmitOrderReqBody) => submitOrder(data),
  });
};
