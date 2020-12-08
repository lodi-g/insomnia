// @flow
import React from 'react';
import type { GrpcMethodType } from '../../../network/grpc/method';
import { GrpcRequestEventEnum } from '../../../common/grpc-events';
import { GrpcMethodTypeEnum } from '../../../network/grpc/method';
import { grpcActions, useGrpc, useGrpcIpc } from '../../context/grpc';
import { sendStartGrpcIpc } from '../../context/grpc/grpc-ipc-renderer';

type Props = {
  requestId: string,
  environmentId?: string,
  methodType: GrpcMethodType | undefined,
};

const GrpcSendButton = ({ requestId, environmentId, methodType }: Props) => {
  const sendIpc = useGrpcIpc(requestId);

  const config = React.useMemo(() => {
    let text = '';
    let onClick = null;
    let disabled = false;

    switch (methodType) {
      case GrpcMethodTypeEnum.unary:
        text = 'Send';
        onClick = () => sendStartGrpcIpc(GrpcRequestEventEnum.sendUnary, requestId, environmentId);
        break;

      case GrpcMethodTypeEnum.client:
        text = 'Start';
        onClick = () => sendIpc(GrpcRequestEventEnum.startClientStream);
        break;

      case GrpcMethodTypeEnum.server:
        text = 'Start';
        onClick = () => sendIpc(GrpcRequestEventEnum.startServerStream);
        break;

      case GrpcMethodTypeEnum.bidi:
        text = 'Start';
        onClick = () => sendIpc(GrpcRequestEventEnum.startBidiStream);
        break;

      default:
        text = 'Send';
        disabled = true;
        break;
    }

    return { text, onClick, disabled };
  }, [sendIpc, methodType, requestId, environmentId]);

  const [{ running }, dispatch] = useGrpc(requestId);

  if (running) {
    return (
      <button className="urlbar__send-btn" onClick={() => sendIpc(GrpcRequestEventEnum.cancel)}>
        Cancel
      </button>
    );
  }

  return (
    <button
      className="urlbar__send-btn"
      onClick={() => {
        config.onClick();
        dispatch(grpcActions.clear(requestId));
      }}
      disabled={config.disabled}>
      {config.text}
    </button>
  );
};

export default GrpcSendButton;
