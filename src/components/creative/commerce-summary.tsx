type CommerceSummaryProps = {
  headingId: string;
};

export function CommerceSummary({ headingId }: CommerceSummaryProps) {
  return (
    <aside className="creative-summary" aria-labelledby={headingId}>
      <h2 id={headingId}>订单摘要</h2>
      <dl>
        <div>
          <dt>商品小计</dt>
          <dd>待商品加入后计算</dd>
        </div>
        <div>
          <dt>配送费用</dt>
          <dd>待配送信息确认</dd>
        </div>
        <div>
          <dt>优惠</dt>
          <dd>暂无可用信息</dd>
        </div>
        <div className="creative-summary-total">
          <dt>应付金额</dt>
          <dd>尚未生成</dd>
        </div>
      </dl>
      <p>商品目录与结算服务尚未开放，本页不会创建订单或发起支付。</p>
    </aside>
  );
}
