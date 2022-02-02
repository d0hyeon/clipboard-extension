import styled from '@emotion/styled'
import { FC, MouseEventHandler, useCallback } from 'react'
import { ClipboardData } from '~common/lib/types'

interface Props extends ClipboardData {
  onClick: (value: string) => void;
  onDelete: (id: string) => void
}

const ClipboardItem: FC<Props> = ({ id, meta, text, onClick, onDelete }) => {
  const handleClick = useCallback(() => {
    onClick(text)
  }, [text, onClick])
  const handleDelete = useCallback<MouseEventHandler>((event)  => {
    event.stopPropagation()
    onDelete(id)
  }, [id, onDelete])
  return (
    <StyledItem onClick={handleClick}>
      <p className="txt">
        {text}
        <i onClickCapture={handleDelete}>삭제</i>
      </p>
      <p>
        <small>{meta.title}</small>
        <small>{meta.url}</small>
      </p>
    </StyledItem>
  )
}

const StyledItem = styled.li`
  padding: 10px;
  list-style: none;
  cursor: pointer;
  
  & ~ & {
    border-top: 1px solid #ddd;
  }

  &:hover {
    background-color: #f0f0f0;
  }
  
  p {
    margin: 0;
    position: relative;
    font-size: 14px;
    line-height: 1.5;

    & ~ p {
      margin-top: 8px;
    }

    &.txt {
      position: relative;
      padding-right: 20px;
    }

    i {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 0;
      font-style: normal;
      line-height: 16px;

      &::before {
        content: '❌';
        font-size: 16px;
      }
    }
    
    small {
      font-size: 10px;
      max-width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      display: block;
      white-space: nowrap;

      & ~ small {
        margin-top: 4px;
      }
    }
  }
`

export default ClipboardItem