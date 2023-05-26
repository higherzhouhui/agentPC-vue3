<script>
import { h, reactive, watchEffect } from 'vue'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'

export default {
  name: 'Table',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    current: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    align: {
      type: String,
      default: 'center'
    },
    hidePagination: {
      type: String,
      default: ''
    },
    showOverflowTooltip: {
      type: Boolean,
      default: true
    }
  },
  setup(props, ctx) {
    const renderColumns = columns =>
      columns.map(column => {
        const { slot, ...args } = column
        const attr = {...args, align: props.align, showOverflowTooltip: props.showOverflowTooltip}
        return h(ElTableColumn, attr, ctx.slots[slot] ?? null)
      })
    const data = reactive({
      key: 1,
      isReRender: true,
      columns: [],
    })

    watchEffect(() => {
      data.key += 1
      data.columns = renderColumns(props.columns)
    })

    const pageProps = {
      background: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      'current-page': 1,
      ...(props.pageProps ?? {}),
    }
    // console.log(props,"props")

    return () =>
      h('div', { key: data.key, class: 'config-table-wrap' }, [
        h(
          ElTable,
          {
            data: props.data,
            style: { width: '100%' },
            ...ctx.attrs,
          },
          data.columns
        ),
        !props.hidePagination
          ? h(
              'div',
              { class: 'page-wrap mt-20' },
              h(ElPagination, {
                ...pageProps,
                total: props.total ?? 0,
                'current-page': props.current,
                'page-size': props.pageSize,
                'page-sizes': [10, 15, 20, 25],
                onCurrentChange(page) {
                  console.log(props, 'props')
                  data.isReRender = false
                  pageProps['current-page'] = page
                  ctx.attrs.pageUpdate?.(page)
                },
                onSizeChange(page) {
                  data.isReRender = false
                  pageProps['current-page'] = page
                  ctx.attrs.sizeUpdate?.(page)
                },
              })
            )
          : null,
      ])
  },
}
</script>

<style lang="scss" scoped>
:deep(.el-table__row) {
  background: #fafafa !important;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
  &.hover-row td {
    background: var(--bg-color-353435);
  }
}

:deep(.el-table) {
  // border: 1px solid #ebeef3;
  border-bottom: 0;
  // border-radius: 10px;
  .el-table__header th {
    background-color: #fafafa;

    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
}

.page-wrap :deep(.el-pagination) {
  justify-content: flex-end;
}
</style>
