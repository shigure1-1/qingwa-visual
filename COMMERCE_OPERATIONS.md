# 晴蛙文创商城运营说明

本文件说明如何在 Supabase 控制台维护晴蛙文创目录，以及如何在外部依赖核验完成后逐步启用交易。当前公开站点默认使用 `COMMERCE_MODE=catalog`，不要在没有真实商品或支付凭据时切换模式。

## 1. 上线原则

- 只发布已经核验的商品、价格、SKU、库存、媒体、配送和政策版本。
- 不使用作品归档图片作为商品图，不用示例数据占位，不手工在前端写商品价格。
- `custom_quote` 用于 IP 定制、私人电影等需要先沟通范围的内容；这类商品显示“价格待确认”，通过联系定制完成下一步。
- 交易模式变更由部署环境变量控制：`catalog` 只浏览，`sandbox` 连接测试环境，`live` 才允许生产交易。

## 2. Supabase 控制台录入顺序

1. **categories**：确认四个分类仍为 `published`，并维护 `sort_order`、中文名、英文名和摘要。
2. **products**：先创建商品，填写所属分类、slug、标题、摘要、完整说明、`sales_mode`、`fulfillment_type`。资料未核验前保持 `draft` 且 `purchasable=false`。
3. **product_variants**：为每个可售规格填写唯一 SKU、规格名、整数分价格和 `CNY` 币种。定制询价商品的 `price_minor` 可为空，但不能标记为直接购买。
4. **product_media**：上传实际商品媒体，填写稳定的 HTTPS/Storage 地址、描述性 alt、宽高和排序。不要引用 `/work/` 下的案例裁图。
5. **inventory_items**：实体商品设置 `on_hand`，初始值与仓储台账一致；数字商品或定制项目必须先确认是否需要库存记录。
6. **shipping_methods**：添加已确认的承运方式并发布；实体物流至少需要一条有效配送方式。
7. **shipping_rate_rules**：按省和可选城市录入整数分运费。更具体的城市规则优先于省级规则，同一组合不能重复。
8. **products / variants**：完成媒体、价格、库存和政策核验后，先发布 variant，再把 product 设置为 `status=published` 和 `purchasable=true`。

## 3. 订单和支付运营

- 订单由 `commerce_checkout` 事务重新读取商品价格、配送规则和库存，并创建订单快照与限时库存预占。
- 购物车不占库存；待支付订单由 `COMMERCE_RESERVATION_MINUTES` 控制预占时长。
- 支付状态只能由验签 webhook 或服务端查询推进。浏览器支付回跳只用于提示“服务端确认中”。
- 微信回调地址：`WECHAT_PAY_NOTIFY_URL`；支付宝回调地址：`ALIPAY_NOTIFY_URL`。生产回调必须是公网 HTTPS，并与商户控制台配置完全一致。
- webhook 事件按 provider event ID 和 payload hash 幂等；重复通知应返回成功但不能重复扣库存。
- 退款先在支付平台执行，再将退款结果和金额写入 `refunds`，不得手工把订单状态改成已退款而跳过支付平台记录。

## 4. 定时任务和履约

使用部署平台的受保护定时任务调用 `POST /api/internal/commerce/reconcile`，携带 `COMMERCE_INTERNAL_SHARED_SECRET`，用于释放过期库存预占和未来的支付对账。不要把该密钥暴露给浏览器。

Supabase 控制台可用于查看订单、履约和发货记录。发货时更新 `fulfillments`、`fulfillment_items` 和 `shipments`，确认承运商与运单号后再推进订单状态。普通日志不得写完整收货地址、手机号、支付原始载荷或任何私钥。

## 5. 启用前 checklist

- [ ] Supabase 项目、service role key、迁移和 RLS 已在目标环境应用。
- [ ] 四分类、商品、SKU、价格、媒体、库存和配送规则已逐项复核。
- [ ] 条款、隐私、退款政策版本已发布，并配置对应环境变量。
- [ ] 公网 HTTPS 站点与 webhook URL 已验证。
- [ ] 微信商户号、API v3 key、商户私钥、平台证书已配置并完成测试通知。
- [ ] 支付宝 app ID、seller ID、应用私钥、公钥/证书已配置并完成异步通知测试。
- [ ] 游客结算、金额校验、库存并发、重复 webhook、过期预占、退款和履约演练完成。
- [ ] 日志、告警、定时任务和回滚开关已确认。

## 6. 回滚

发现价格、库存、支付或回调异常时，先将部署环境的 `COMMERCE_MODE` 改回 `catalog` 并重新部署。该模式会阻止购物车写入、checkout、支付创建和订单读取，同时保留已核验的分类浏览。修复外部依赖后先在 `sandbox` 回归，再按发布流程进入 `live`。

## 7. 必须补齐的外部资料

当前项目未提供 Supabase 凭据、真实商品与商品图、价格、SKU、库存、配送/税费规则、退换政策、生产域名、微信商户资料或支付宝应用资料。以上资料未完成前，站点必须保持交易关闭。
