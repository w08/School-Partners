import React, { FC, useState, ChangeEvent } from 'react'
import { Table, Button, Popconfirm, Tag, Input, Empty } from 'antd';
import { ColumnProps } from 'antd/es/table'
import { CustomBreadcrumb } from '@/admin/components'
import { ExerciseListProps } from '@/admin/modals/exerciseList'
import { generateDifficulty, generateExerciseType } from '@/admin/utils/common'

import { useService } from '@/admin/hooks'

import './index.scss'

const ExerciseList: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const hasSelected: boolean = selectedRowKeys.length > 0

  const handleSelectedChange = (selectedRowKeys: number[]) => {
    console.log(selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }

  const handleSearchChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = changeEvent
    setSearchValue(value)
  }

  const handleEditClick = (exerciseId: number) => {
    console.log(exerciseId)
  }

  const handleDeleteClick = (exerciseId: number) => {
    console.log(exerciseId)
  }

  const handleBatchDelete = () => {
    console.log(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectedChange,
  }

  const columns: ColumnProps<ExerciseListProps>[] = [
    {
      title: '题目名称',
      dataIndex: 'exerciseName',
      key: 'exerciseName',
      width: 180,
      filteredValue: [searchValue],
      onFilter: (_, row) => (
        row.exerciseName.indexOf(searchValue) !== -1
      )
    }, {
      title: '题目内容',
      dataIndex: 'exerciseContent',
      key: 'exerciseContent',
      ellipsis: true,
    }, {
      title: '题目类型',
      dataIndex: 'exerciseType',
      key: 'exerciseType',
      width: 120,
      render: exerciseType => {
        const { type, color } = generateExerciseType(exerciseType)
        return (
          <Tag color={color}>
            {type}
          </Tag>
        )
      },
      sorter: (a, b) => a.exerciseType - b.exerciseType
    }, {
      title: '难易度',
      dataIndex: 'difficultyDegree',
      key: 'difficultyDegree',
      width: 100,
      render: difficultyDegree => {
        const { difficulty, color } = generateDifficulty(difficultyDegree)
        return (
          <Tag color={color}>
            {difficulty}
          </Tag>
        )
      },
      sorter: (a, b) => a.difficultyDegree - b.difficultyDegree
    }, {
      title: '是否热门',
      dataIndex: 'isHot',
      key: 'isHot',
      width: 120,
      render: isHot => isHot ? '是' : '否',
      sorter: a => a.isHot ? 1 : -1
    }, {
      title: '操作',
      dataIndex: '',
      key: '',
      width: 180,
      render: (_, row) => (
        <span>
          <Button
            type="primary"
            onClick={() => handleEditClick(row.exerciseId)}>编辑</Button>
          <Popconfirm
            title="确定删除此课程吗?"
            onConfirm={() => handleDeleteClick(row.exerciseId)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="danger">删除</Button>
          </Popconfirm>
        </span>
      )
    }
  ]
  const { isLoading = false, response } = useService('/exercises', 'GET')
  const { exerciseList = [], total: totalPage = 0 } = response || {}

  return (
    <div>
      <CustomBreadcrumb list={['内容管理', '题库管理']} />
      <div className="exercise-list__container">
        <div className="exercise-list__header">
          <Button type="primary" style={{ marginRight: 10 }}>新增题目</Button>
          <Button type="danger"
            disabled={!hasSelected}
            onClick={handleBatchDelete}>批量删除</Button>
          <Input.Search
            className="search__container"
            value={searchValue}
            placeholder="请输入要查询的题目名称"
            onChange={handleSearchChange}
            enterButton />
        </div>
        <Table
          rowSelection={rowSelection}
          dataSource={exerciseList}
          columns={columns}
          rowKey="exerciseId"
          scroll={{
            y: "calc(100vh - 300px)"
          }}
          loading={{
            spinning: isLoading,
            tip: "加载中...",
            size: "large"
          }}
          pagination={{
            pageSize: 10,
            total: totalPage,
            current: currentPage,
            onChange: (pageNo) => setCurrentPage(pageNo)
          }}
          locale={{
            emptyText: <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据" />
          }}
        />
      </div>
    </div>
  )
}

export default ExerciseList